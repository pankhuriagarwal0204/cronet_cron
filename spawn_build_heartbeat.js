var exports = module.exports = {};

exports.generate_packet = function (packet, cb) {
    var spawn_build_heartbeat = require('child_process').spawn,
        py_heartbeat = spawn_build_heartbeat('python', ['cronpacket/build_heartbeat.py', packet]);

    py_heartbeat.stdout.on('data', function (data) {
        //console.log("in spawn build heartbeat", data.toString());
        var length = data.length - 1;
        data = data.slice(0, length);
        console.log(data);
        cb(data);
    });
    py_heartbeat.stderr.on('data', function (data) {
        //console.log("in spawn build heartbeat", data.toString());
        console.log(unpack(data), "in spawn build heartbeat");
        cb(data);
    });

}
