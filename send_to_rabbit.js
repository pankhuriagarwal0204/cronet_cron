#!/usr/bin/env node

var amqp = require('amqplib/callback_api');


amqp.connect('amqp://localhost', function(err, conn) {
  conn.createChannel(function(err, ch) {
    var ex = 'cron';
    var args = process.argv.slice(2);
    var routing_key = (args.length > 0) ? args[0] : 'intrusion.packet';
    var msg = '{ "data":' + JSON.stringify(process.argv.slice(3)) + '}';

    ch.assertExchange(ex, 'topic', {durable: true});
    ch.publish(ex, routing_key, new Buffer(msg));
    console.log(" [x] Sent %s:'%s'", routing_key, msg);
  });

  setTimeout(function() { conn.close(); process.exit(0) }, 500);
});