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
};

response = {101: 'GATEWAY_TO_CORE_API_HEARTBEAT_RESPONSE',
    103: 'BASE_TO_REMOTE_HEARTBEAT_RESPONSE',
    105: 'REMOTE_TO_GATEWAT_HEARTBEAT_RESPONSE',
    202: 'CRONET_PACKET_RECEIVE_ACQ',
    107: 'SPARTAN_TO_GATEWAT_HEARTBEAT_RESPONSE',
    204: 'CRONET_PACKET_RECEIVE_ACQ',
    109: 'SKYWATCH_TO_GATEWAY_HEARTBEAT_RESPONSE',
    301: 'CRONET_PACKET_RECEIVE_ACQ',
    304: 'CRONET_PACKET_RECEIVE_ACQ',
    201: 'CRONET_PACKET_RECEIVE_ACQ',
    303: 'CRONET_PACKET_RECEIVE_ACQ'};

client.set("Serial-Reader-Exchange", "serialreader", redis.print);

client.set("Serial-Writer-Exchange" , "serialwriter", redis.print);

client.hmset("queues", types, redis.print);

client.hmset("workers", workers, redis.print);

client.hmset("response", response, redis.print);

client.set("writerqueue" , "writer", redis.print);

client.quit();
