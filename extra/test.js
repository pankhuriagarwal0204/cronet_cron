// var disp_all = require('./disp_all');
//
// //disp_all.disp();
//
// var build_heartbeat = require('./spawn_build_heartbeat');
// main();
// function main() {
//     send_to_queue();
// }
//
// function send_to_queue() {
//     console.log("in send_to_queue");
//     build_heartbeat.generate_packet(cb);
//
//     function cb(data) {
//         msg = data.toString();
//         console.log(msg);
//         //ch.sendToQueue(q, new Buffer(msg));
//         console.log(" [x] Sent ", msg);
//
//     }
// }
var a = ['a','b','c'];
var b = ['s', 'g', 'h'];

if(a.indexOf("d")>-1) {
    console.log("true");
} else {
    console.log("false");
}