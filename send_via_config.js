var redis = require("redis");
var client = redis.createClient();

var amqp = require('amqplib/callback_api');

client.get("Serial-Reader-Exchange", exchange_name_fetch_cb);

function exchange_name_fetch_cb(err, exchange) {

    amqp.connect('amqp://localhost', function (err, conn) {

        conn.createChannel(function (err, ch) {
            ch.assertExchange(exchange, 'topic', {durable: true});

            client.hgetall("workers", function (err, reply) {
                var queue = 'heartbeat';
                var worker = 2;
                //worker = reply[queue];
                    ch.assertQueue(queue, {durable: true});
                    ch.bindQueue(queue, exchange, queue);
                    message = queue + worker;
                    ch.publish(exchange,queue,new Buffer(message)) ;

                    console.log("[x] sent", message, "on", exchange, "via", queue);
                // for (var queue in reply) {
                //
                // }
                //conn.close();
            });
        });

    });
}


//client.quit();