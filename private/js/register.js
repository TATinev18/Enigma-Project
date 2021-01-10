let db = require('./DB');

let con = db.connection;


try {
    con.connect(function(err) {
        if (err) throw err;
        console.log("Connected!");
    });
}catch (e) {
    console.log("Chupq se v register"+e);
}

module.exports.register = register;


function register(request){

}
