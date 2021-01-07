// module.exports ={
//     validate : function validateForm(request) {
//                 $("#registration").validate({
//             rules: {
//                 submitHandler: function() {
//                     register(request);
//                 },
//                 username:{
//                     required: true,
//                     minlength: 6
//                 },
//
//                 email: {
//                     required: true,
//                     // Specify that email should be validated
//                     // by the built-in "email" rule
//                     email: true
//                 },
//                 password: {
//                     required: true,
//                     minlength: 6
//                 },
//                 confirmPassword: {
//                     equalTo : "#password"
//                 }
//             },
//             // Specify validation error messages
//             messages: {
//                 username: {
//                     required: "Please provide a username",
//                     minlength: "Your username must be at least 6 characters long"
//                 },
//                 password: {
//                     required: "Please provide a password",
//                     minlength: "Your password must be at least 6 characters long"
//                 },
//                 email: "Please enter a valid email address",
//                 confirmPassword: "Password does not match"
//             },
//             errorElement : 'div',
//             errorLabelContainer: '.errorTxt'
//         });
//     }
//
// }
$(function () {
    $("#registration").validate({
        rules: {
            username:{
                required: true,
                minlength: 6
            },

            email: {
                required: true,
                // Specify that email should be validated
                // by the built-in "email" rule
                email: true
            },
            password: {
                required: true,
                minlength: 6
            },
            confirmPassword: {
                equalTo : "#password"
            }
        },
        // Specify validation error messages
        messages: {
            username: {
                required: "Please provide a username",
                minlength: "Your username must be at least 6 characters long"
            },
            password: {
                required: "Please provide a password",
                minlength: "Your password must be at least 6 characters long"
            },
            email: "Please enter a valid email address",
            confirmPassword: "Password does not match"
        },
        errorElement: "span",
        errorLabelContainer: '.errorTxt',
        submitHandler: function(form) {
            form.submit();
        }
    });
});


