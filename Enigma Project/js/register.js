let server = require('http').createServer();
let db = require('./DB');
let bcrypt = require('bcrypt');
let con = db.connection;





function validation(username,email,password,confirmPassword){
    if (email==""){
        document.getElementById("emailErr").innerHTML = "Please provide an email";
        return 0;
    }else if (username.length<6){
        document.getElementById("usernameErr").innerHTML = "Your username must be at least 6 characters long";
        return 0;
    }else if (password.length<6) {
        document.getElementById("passwordErr").innerHTML = "Your username must be at least 6 characters long";
        return 0;
    }else if (confirmPassword!=password) {
        document.getElementById("confirmPasswordErr").innerHTML = "Passwords does not match";
        return 0;
    }
    return 1;
}

function register(){
    let username = document.getElementsByName("username").value();
    let email = document.getElementsByName("username").value();
    let password = document.getElementsByName("username").value();
    let confirmPassword = document.getElementsByName("username").value();
    if (!validation(username,email,password,confirmPassword)){
        return 0;
    }
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
try {
    server.listen(6969);
} catch (error) {
    console.error(error);
}
