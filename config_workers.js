/**
 * Created by pankhuri-agarwal on 19/1/17.
 */
var redis = require("redis");
var client = redis.createClient();
var app = require('http').createServer();
app.listen(3000);
var io = require('socket.io')(app);
var pg = require('./postgres');
var process_spawned = require("./node_spawning_python");
var pg_client = pg.connect();
var disp_all = require('./disp_all');
var amqp = require('amqplib/callback_api');
var writer = require('./writer.js');

client.get("Serial-Reader-Exchange", exchange_name_fetch_cb);

function exchange_name_fetch_cb(err, exchange) {

    if (err) {
        console.log("exchange name could not be found from redis");
        setTimeout(function () {
            process.exit(0);
        }, 500);
    }

    client.hgetall("workers", function (err, reply) {

        if (err) {
            console.log("workers could not be found from redis");
            setTimeout(function () {
                process.exit(0);
            }, 500);
        }

        for (var queue in reply) {
            worker(exchange, queue, reply[queue]);
        }
    });
}

function worker(exchange, queue, worker) {

    var critical_queues = ['intrusion', 'sys-failure'];

    amqp.connect('amqp://localhost', function (err, conn) {

        if (err) {
            console.log("cannot connect to rabbit");
            setTimeout(function () {
                process.exit(0);
            }, 500);
        }
        conn.createChannel(function (err, ch) {
            ch.assertExchange(exchange, 'topic', {durable: true});
            ch.assertQueue(queue, {durable: true});
            ch.bindQueue(queue, exchange, queue);
            console.log("queue --> %s on exchange--> %s has workers -->", queue, exchange, worker)
            for (var i = 0; i < worker; i++) {
                message_consumer(ch);
            }
        });
    });

    function message_consumer(ch) {
        ch.consume(queue, function (msg) {
            console.log(" [x] Received on %s", queue);
            buf = msg.content;
            val = buf.toString('hex');
            process_and_insert(val, ch, msg);
        }, {noAck: false});
    }

    function process_and_insert(data, ch, msg) {
        if (critical_queues.indexOf(queue) > -1) {
            process_spawned.data_to_json(data, ch, msg, emit_and_insert);
        } else {
            process_spawned.data_to_json(data, ch, msg, insert_into_truth);
        }
        // //disp_all.disp();
    }

    function insert_into_truth(ch, msg, value) {
        console.log("from python in insert_into_db", value);
        pg_client.query("INSERT INTO abcd(val) values($1)", [value], function (err, data) {
            if (!err) {
                ch.ack(msg);
                var packet = value['packet_type'];
                packet = packet.slice(1,-2);
                writer.write_response(packet);
                console.log(packet);
            } else {
                ch.reject(msg, true);
            }
        });
    }

    function emit_and_insert(ch, msg, value) {
        console.log("from python critical packet", value);
        client.hmset("critical_data", value, function (err, data) {
            if (!err) {
                io.emit('event_critical', value);
                insert_into_truth(ch, msg, value);
            } else {
                ch.reject(msg, true);
            }
        });

    }
}