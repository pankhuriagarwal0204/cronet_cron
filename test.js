/**
 * Created by pankhuri-agarwal on 20/1/17.
 */
var redis = require("redis");
var client = redis.createClient();
var app = require('http').createServer();
app.listen(3000);
var io = require('socket.io')(app);
var pg = require('./postgres');
var process = require("./node_spawning_python");
var pg_client = pg.connect();

client.hmset("critical_data", 'abc',1, redis_cb);
function redis_cb(err, data) {
    console.log("after cb writing redis",data);
    var value = {'a':'abc'};
     pg_client.query("INSERT INTO abc(val) values($1)", [value], function (err, data) {
         console.log("error ", err);
         console.log("success", data);
     });
}
console.log("after client");