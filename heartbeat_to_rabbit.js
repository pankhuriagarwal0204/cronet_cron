#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var build_heartbeat = require('./spawn_build_heartbeat');

var redis = require("redis");
var client = redis.createClient();

client.get("Serial-Reader-Exchange", exchange_name_fetch_cb);

function exchange_name_fetch_cb(err, exchange) {

    amqp.connect('amqp://localhost', function (err, conn) {

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


//client.quit();


function send_to_queue(ch, queue, exchange) {
    console.log("in send_to_queue");

    build_heartbeat.generate_packet(cb);
    function cb(data) {
        msg = data.toString('hex');
        console.log(msg);
        ch.publish(exchange, queue, data);
        console.log(" [x] Sent ", msg);
    }
}


