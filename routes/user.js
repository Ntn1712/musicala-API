const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");
const userFunctions = require("../services/userFunctions");
const userServices = require("../services/userServices");
const request = require("request-promise");
const mongoose = require("mongoose");
const artistRoutes = require("../routes/artist");
router.use(artistRoutes);

router.get("/", (req, res) => {
    res.redirect("/login");
})

router.get("/login", (req, res) => {
    res.render("login")
})

router.post("/login",
    passport.authenticate("login", {
        successRedirect: "/user-role",
        failureRedirect: "/login"
    }), (req, res, next)=>{

    }
);

router.get("/register", (req, res) => {
    res.render("register");
});

router.post("/register", async (req, res, next) => {
    // const options = {
    //     method: "POST",
    //     uri: "https://www.google.com/recaptcha/api/siteverify",
    //     formData: {
    //         secret: process.env.RECAPTCHA_SECRET,
    //         response: req.body["g-recaptcha-response"]
    //     }
    // };
    // request(options)
    //     .then(response => {
    //         let cResponse = JSON.parse(response);
    //         if (!cResponse.success) {
    //             return res.redirect("/register", { message: "Invalid Captcha" });
    //         }
            return userFunctions.addUser(req.body)
                .then(message => {
                    if (message === "ok")
                        return res.redirect("/login");
                })
                .catch(err => {
                    console.log(err);
                    next(err);
                })
        });

    // const options = {
    //     method: "POST",
    //     uri: "https://www.google.com/recaptcha/api/siteverify",
    //     formData: {
    //         secret: process.env.RECAPTCHA_SECRET,
    //         response: req.body["g-recaptcha-response"]
    //     }
    // };
    // request(options)
    //     .then(response => {
    //         let cResponse = JSON.parse(response);
    //         if (!cResponse.success) {
    //             return res.redirect("/register", { message: "Invalid Captcha" });
    //         }
    // return userFunctions.addUser(req.body)
    //     .then(message => {
    //         if (message === "ok")
    //             return res.send("/user-role");

    //     })
    //     .catch(err => {
    //         console.log(err);
    //         next(err);
    //     })

// });

router.get("/user-role", (req, res, next) => {
    try {
        console.log("entered user role");
        if (req.user.role === "artist") {
            res.redirect("/artist/" + req.user._id);
        }
        if (req.user.role === "teacher") {
            res.redirect("/teacher/" + req.user._id);
        }
        if (req.user.role === "studio") {
            res.redirect("/studio/" + req.user._id);
        }
        if (req.user.role === "company") {
            res.redirect("/company/" + req.user._id);
        }
        if (req.user.role === "school") {
            res.redirect("/school/" + req.user._id);
        }
        if (req.user.role === "college") {
            res.redirect("/college/" + req.user._id);
        }
        if (req.user.role === "band") {
            res.redirect("/band/" + req.user._id);
        }
    } catch (err) {
        next(err);
    }
});




router.get("/logout", (req, res) => {
    req.logout();
});



module.exports = router;
