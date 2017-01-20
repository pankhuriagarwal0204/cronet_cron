#!/usr/bin/env node

var amqp = require('amqplib/callback_api');
var pg = require('./postgres');
var process = require("./node_spawning_python");
var data = [0xFF, 0xFF, 0xFD, 0x01, 0x0D, 0x00, 0x01, 0x00, 0x02, 0x00, 0x01, 0x00];
var client = pg.connect();
var disp_all = require('./disp_all');
amqp.connect('amqp://localhost', rabbit_connected_cb);

function rabbit_connected_cb(err, conn) {
    conn.createChannel(channel_created_cb);
}
function channel_created_cb(err, ch) {
    var ex = 'cron';
    var key = '*.packet';
    var args = {'x-priority': 5};

    ch.assertExchange(ex, 'topic', {durable: true});

    ch.assertQueue('', {durable: true}, function (err,q) {
         console.log(' [*] Waiting for logs. To exit press CTRL+C');

    ch.bindQueue(q.queue, ex, key, args);

    ch.consume(q.queue, process_received_data, {noAck: true});
    });
}
function process_received_data(msg) {
    console.log("consumes all the messages");
    console.log(" [x] %s:'%s'", msg.fields.routingKey, msg.content.toString());
    value = msg.content.toString();
    process_and_insert(data);
}
function process_and_insert(data) {
    process.data_to_json(data, insert_into_database);
    disp_all.disp();
}
function insert_into_database(value) {
    client.query("INSERT INTO abcd(val) values($1)", [value]);
}