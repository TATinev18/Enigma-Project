let db = require('./DB');
let bcrypt = require('bcrypt');
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
    console.log(request);
    return 0;
    let username = request.body.username;
    let email = request.body.email;
    let password = request.body.password;
    let confirmPassword = request.body.confirmPassword;
    console.log("SLIVI");
    let hashPassword = bcrypt.hashSync(password, 10);
    con.query('SELECT * FROM users WHERE username=? OR email=?', [username,email], function (error, result, fields) {
        console.log("Result: "+result);
        console.log("Error: "+error);
        if (error!=null && error!=undefined){
            console.log(error);
        }
        if (result.username==username){
            return "Account with tha username already exist";
        }
        if (result.email ==email){
            return "Account with tha email already exist"
        }
        else{
            console.log(password);
            con.query('INSERT INTO users (username, email, password) VALUES  (?, ?, ?)', [username,email,hashPassword], function (error, result, fields)

            {
                console.log(error);
                console.log(result);
            })
        }
    });
}
