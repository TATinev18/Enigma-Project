let mysql = require('mysql');
//ANTON
let config = {
    host: "localhost",
    user: "root",
    password: "",
    database: 'enigmaproject',
    port: 3306
};
try {
    var connection =mysql.createConnection(config);
}catch (e) {
    console.log("Chupq se po vreme na requere-a "+e);
}

module.exports.connection = connection;
