const Promise = require("bluebird");
const userService = require("./userServices");
const User = require("../models/user");



module.exports.getUsers = () => {
    return new Promise((resolve, reject) => {
        try {
            User.find({})
                .exec()
                .then(users => {
                    return resolve(users);
                })
                .catch(err => reject(err));
        } catch (error) {
            return reject(error);
        }
    });
};

module.exports.addUser = (userDetails) => {
    return new Promise((resolve, reject) => {
        try {
            User.find({
                $and: [{ name: userDetails.name }, { email: userDetails.email }]
            }).exec()
                .then(user => {
                    console.log("query success");
                    console.log(user);
                    // if (user) {
                    //     message = "User already registerd";
                    //     return resolve(message);
                    // }
                    // console.log(message);
                    message = userService.validate(userDetails);
                    if (message !== "ok") return resolve(message);
                    let newUser = new User(userDetails);
                    newUser.name = userDetails.name;
                    newUser.email = userDetails.email;
                    newUser.phone = userDetails.phone;
                    newUser.address = userDetails.address;
                    newUser.genre = userDetails.genre;
                    newUser.role = userDetails.role;
                    newUser.password = newUser.generateHash(userDetails.password);
                    console.log(newUser);
                    newUser.save().then(savedUser => resolve("ok"));
                })
                .catch(err => reject(err));
        } catch (err) {
            console.log(error);
            return reject(error);
        }
    })
};

module.exports.deleteUser = id => {
    return new Promise((resolve, reject) => {
        try {
            User.findOne({
                _id: id
            })
                .exec()
                .then(user => {
                    if (!user) {
                        return reject(new Error("User doesn't exist"));
                    }
                    user
                        .remove()
                        .then(() => resolve())
                        .catch(err => reject(err));
                })
                .catch(err => reject(err));
        } catch (error) {
            return reject(error);
        }
    });
};

module.exports.updateUser = userDetails => {
    return new Promise((resolve, reject) => {
        try {
            return User.findByIdAndUpdate(
                userDetails._id,
                { $set: userDetails },
                { new: true }
            )
                .exec()
                .then(user => {
                    if (!user) {
                        return reject(new Error("User not found"));
                    }
                    return resolve(user);
                })
                .catch(err => reject(err));
        } catch (error) {
            return reject(error);
        }
    });
};