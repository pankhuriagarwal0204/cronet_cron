var exports = module.exports = {};

exports.write_response = function (key) {

    var redis = require("redis");
    var client = redis.createClient();
    var amqp = require('amqplib/callback_api');
    var build_heartbeat = require('./spawn_build_heartbeat');

    client.get("Serial-Writer-Exchange", exchange_name_fetch_cb);

    function exchange_name_fetch_cb(err, exchange) {

        if (err) {
            console.log("exchange name could not be found from redis");
            setTimeout(function () {
                process.exit(0);
            }, 500);
        }

        client.get("writerqueue", writer_queue_fetched_cb);

        function writer_queue_fetched_cb(err, queue) {

            if (err) {
                console.log("writer queue could not be found from redis");
                setTimeout(function () {
                    process.exit(0);
                }, 500);
            }

            amqp.connect('amqp://localhost', function (err, conn) {

                if (err) {
                    console.log("cannot connect to rabbit");
                    setTimeout(function () {
                        process.exit(0);
                    }, 500);
                }
                conn.createChannel(function (err, ch) {
                    ch.assertExchange(exchange, 'topic', {durable: true});
                    worker = 1;
                    ch.assertQueue(queue, {durable: true});
                    ch.bindQueue(queue, exchange, queue);
                    send_to_queue(ch, queue, exchange);
                });
            });
        }

    }

    function send_to_queue(ch, queue, exchange) {
        console.log("in send_to_queue");

        client.hgetall("response", response_fetched_cb);

        function response_fetched_cb(err, data) {
            var packet = data[key];

            function cb(data) {
                msg = data.toString('hex');
                console.log(msg);
                ch.publish(exchange, queue, data);
                console.log(" [x] Sent ", msg);
                setTimeout(function () {
                    process.exit(0);
                }, 500);
            }

            if (packet) {
                build_heartbeat.generate_packet(packet, cb);
            } else {
                console.log("response not provided for this packet");
                setTimeout(function () {
                    process.exit(0);
                }, 500);
            }
        }
    }

}