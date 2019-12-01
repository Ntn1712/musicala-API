const User = require("../models/user");

module.exports.validate = userDetails => {
    try {
        var name = userDetails.name;
        var email = userDetails.email;
        var phone = userDetails.phone;
        phone = phone.length;
        var address = userDetails.address;
        var password = userDetails.password;
        password = password.length;
        var message = "ok";
        console.log("inside validate");
        if (!/^[a-zA-Z][a-zA-Z ]+[a-zA-Z]$/.test(name)) {
            message = "Name should only have alphabets!";
            console.log(message);

            return message;
        }
        if (phone != 10) {
            message = "Phone number format invalid";
            console.log(message);

            return message;
        }
        if (password < 8) {
            message = "Password length must be greater than 8 letters ";
            console.log(message);
            return message;
        }
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
            message = "Not a valid email";
            console.log(message);
            return message;
        }
        console.log(message);
        return message;
    }
    catch(err){
        throw err;
    }
};

