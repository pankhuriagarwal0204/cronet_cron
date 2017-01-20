process.on('message', function (message) {
    var pg = require('./postgres');
    var process = require("./node_spawning_python");
    var redis = require("redis");
    var client = redis.createClient();
    var pg_client = pg.connect();
    var disp_all = require('./disp_all');
    var exchange = message['ex'];
    var queue = message['q'];
    var worker = message['worker'];
    var amqp = require('amqplib/callback_api');
    var critical_queues = ['intrusion'];
    if (critical_queues.indexOf(queue) > -1) {
        var io = require('socket.io-client');
        var socket = io.connect('http://localhost:3000', {reconnect: true});
    }

    amqp.connect('amqp://localhost', function (err, conn) {
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
            console.log(buf);
            val = buf.toString('hex');
            process_and_insert(val);
        }, {noAck: true});
    }

    function process_and_insert(data) {
        if (critical_queues.indexOf(queue) > -1) {
            process.data_to_json(data, emit_and_insert);
        } else {
            process.data_to_json(data, insert_into_truth);
        }
        //disp_all.disp();
    }

    function insert_into_truth(value) {
        console.log("from python in insert_into_db", value);
        pg_client.query("INSERT INTO abcd(val) values($1)", [value]);
    }

    function emit_and_insert(value) {
        console.log("from python critical packet", value);
        client.hmset("critical_data", value);
        socket.emit('event_critical', value);
        insert_into_truth(value);
    }
});