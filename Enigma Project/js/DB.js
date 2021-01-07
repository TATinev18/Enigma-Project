let mysql = require('mysql');
//ANTON
let config = {
    host: "localhost",
    user: "root",
    password: "",
    database: 'enigmaproject',
    port: 3306
};
let connection =mysql.createConnection(config);
module.exports ={
    connection : mysql.createConnection(config)
}
