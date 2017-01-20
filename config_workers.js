/**
 * Created by pankhuri-agarwal on 19/1/17.
 */
var redis = require("redis");
var client = redis.createClient();
var parent = require('child_process').fork;
var child = parent('./child_process.js');
var app = require('http').createServer();
app.listen(3000);
var io = require('socket.io')(app);

client.get("Serial-Reader-Exchange", exchange_name_fetch_cb);

function exchange_name_fetch_cb(err, exchange) {

    client.hgetall("workers", function (err, reply) {

        for (var queue in reply) {
            child.send({ex: exchange, q: queue, worker: reply[queue]});
            child.on('data', function (data) {
                console.log(data);
            });
        }
    });
}

