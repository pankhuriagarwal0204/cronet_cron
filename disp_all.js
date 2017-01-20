var pg = require('./postgres');
var client = pg.connect();
var query = client.query("SELECT * FROM abcd");
query.on("row", function (row, result) {
    result.addRow(row);
});
var exports = module.exports = {};

exports.disp = function() {
    query.on("end", function (result) {
        console.log(JSON.stringify(result.rows, null, "    "));
    });
}
