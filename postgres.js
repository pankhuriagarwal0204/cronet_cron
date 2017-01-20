/**
 * Created by pankhuri-agarwal on 17/1/17.
 */
var exports = module.exports = {};
exports.connect = function () {
    var pg = require('pg');
    var conString = "postgres://postgres:postgres@localhost:5432/cron_test";
    var client = new pg.Client(conString);
client.connect();

client.query("CREATE TABLE IF NOT EXISTS abcd(id SERIAL PRIMARY KEY, val json)");

return client;



}