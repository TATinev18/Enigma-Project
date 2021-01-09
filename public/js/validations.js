const queryString = require('query-string');
const http = require('http');

var registerOptions = {
    host: 'localhost',
    port: '8090',
    path: '/register',
    method: 'POST',
};

function validationRegister(){
    console.log("VALIDATION");
    return 0;
    var body ={
        username,
        email,
        password,
        confirmPassword
    };
    body.username = document.getElementsByName('username').value;
    body.email = document.getElementsByName('email').value;
    body.password = document.getElementsByName('password').value;
    body.confirmPassword = document.getElementsByName('confirmPassword').value;

    if (body.email==""){
        document.getElementById("emailErr").innerHTML = "Please provide an email";
        return 0;
    }else if (body.username.length<6){
        document.getElementById("usernameErr").innerHTML = "Your username must be at least 6 characters long";
        return 0;
    }else if (body.password.length<6) {
        document.getElementById("passwordErr").innerHTML = "Your username must be at least 6 characters long";
        return 0;
    }else if (body.confirmPassword!=password) {
        document.getElementById("confirmPasswordErr").innerHTML = "Passwords does not match";
        return 0;
    }
    let req = http.request(registerOptions, (res) =>{
        res.setEncoding('utf8');
        res.on('data', (chunk) => {
            console.log(`BODY: ${chunk}`);
        });

    })
    req.write(body);
    req.end();
}
{}
