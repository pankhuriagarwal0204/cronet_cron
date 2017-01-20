var exports = module.exports = {};

exports.generate_packet = function (cb) {
    var spawn_build_heartbeat = require('child_process').spawn,
        py_heartbeat = spawn_build_heartbeat('python', ['cronpacket/build_heartbeat.py']);
    function unpack(str) {
    var bytes = [];
    for(var i = 0; i < str.length; i++) {
        var char = str.charCodeAt(i);
        //bytes.push(char >>> 8);
        bytes.push(char & 0xFF);
    }
    return bytes;
}
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
