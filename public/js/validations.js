// const queryString = require('query-string');
// const http = import('http');
// var registerOptions = {
//     host: 'localhost',
//     port: '8090',
//     path: '/register',
//     method: 'POST',
// };
// let req = http.request(registerOptions, (res) =>{
//     res.setEncoding('utf8');
//     res.on('data', (chunk) => {
//         console.log(`BODY: ${chunk}`);
//     });
//
// })
// req.write(body);
// req.end();

    document.getElementById('submit').addEventListener("click", function(event){
        if (validationRegister()==0){
            event.preventDefault();
        }else{
            reciveServerValidation();
        }
    });


function validationRegister(){
    console.log("VALIDATION");
    var username = document.getElementsByName('username')[0].value;
    var email = document.getElementsByName('email')[0].value;
    var password = document.getElementsByName('password')[0].value;
    var confirmPassword = document.getElementsByName('confirmPassword')[0].value;
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
