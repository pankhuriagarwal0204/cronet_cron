var redis = require('redis');
var client = redis.createClient();

client.on("error", function (err) {
    console.log("Error " + err);
});

types = {
    'packet-ack': '1',
    'heartbeat': '101, 102, 103, 104, 105, 106, 107, 108, 109, 110',
    'sys-failure': '301, 302, 303, 304, 305',
    'intrusion': '201, 202, 203, 204',
};

workers = {
    'packet-ack': 1,
    'heartbeat': 1,
    'sys-failure': 2,
    'intrusion': 10,
}

client.set("Serial-Reader-Exchange", "serialreader", redis.print);

client.hmset("queues", types, redis.print);

client.hmset("workers", workers, redis.print);

client.quit();
