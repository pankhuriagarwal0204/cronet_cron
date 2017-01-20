var exports = module.exports = {};

exports.data_to_json = function (input, cb) {

    var spawn_bytes_to_json = require('child_process').spawn,
        py = spawn_bytes_to_json('python', ['cronpacket/bytes_to_json.py', input]);
    var res = {};

    //console.log(new Buffer(input));

    //console.log("writing in stdin", data);
    //py.stdin.write(input);
    // py.on('exit', function (code) {
    //     console.log("Exited with code " + code);
    // });
    // py.on('error', function (error) {
    //     console.log("Error: bad command", error);
    // });

    py.stdout.on('data', function (data) {
        //console.log(data.toString(), "from stdout");
        val = data.toString().split("\n");
        //console.log("from python", val);
        val.forEach(function (data) {
            data = data.split(" ");
            if (data[1]) {
                res[data[0]] = data[1];
            }
        });
        cb(res);
        //console.log("done stdout");
    });

    py.stdout.on('end', function () {
    });

    py.stderr.on('data', function (data) {
        console.log("ERROR", data.toString())
        }

    )

    // py.stdin.end();

};

