var nodemailer = require('nodemailer');

module.exports.resetPassword = resetPasswordMail;
var transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 465,
    secure: false,
    requireTLS: true,
    auth: {
        user: 'technicalknockoutv2.0@gmail.com',
        pass: 'enigmaproject'
    },

});

function resetPasswordMail(userEmail,token) {
    var mailOptions = {
        from: 'technicalknockoutv2.0@gmail.com',
        to: userEmail,
        subject: 'Reset password',
        text: 'http://localhost:8080/checkToken?token='+token,
    };
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
        }
    });
}



