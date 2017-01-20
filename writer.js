var redis = require("redis");
var client = redis.createClient();
var amqp = require('amqplib/callback_api');

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
                var queue = 'intrusion';
                worker = 1;
                ch.assertQueue(queue, {durable: true});
                ch.bindQueue(queue, exchange, queue);
                send_to_queue(ch, queue, exchange);
            });
        });
    }

}

