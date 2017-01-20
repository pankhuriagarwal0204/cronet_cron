// var i = 0;
// function set_time_value(val) {
//     setTimeout(function () {
//         console.log(i);
//         i = i+1;
//         set_time_value(val);
//     }, val )
// };
//
// set_time_value(1000);
//
// function a() {
//     var b = 2;
//     var bb = setTimeout(function () {
//         var b = 5;
//     }, 0);
//     return b;
// }
//
// function c() {
//     var d = a();
//     console.log(d, "value");
// }
// c();

var a = [ 255,
  255,
  253,
  253,
  255,
  253,
  0,
  1,
  0,
  14,
  0,
  0,
  0,
  23,
  0,
  0,
  0,
  45,  0,  0,  0,  101,  0,  0, 0,  1,  0,  116,
  0,
  101,
  0,
  115,
  0,
  116,
  0,
  105,  0,
  110,
  0,
  103 ];
var b = []
 a.forEach(function (data) {
   data = data.toString(16);
    console.log(data);
    b.push(data);
});
//console.log(b);
