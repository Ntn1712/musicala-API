require("dotenv").config();
const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const multer = require("multer");
const cloudinary = require("cloudinary");
const cloudinaryStorage = require("multer-storage-cloudinary");
// var cloud = require("../config/cloudinary");

cloudinary.config({
    cloud_name: 'musicvaala',
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

const storage = cloudinaryStorage({
    cloudinary: cloudinary,
    allowedFormats: ["jpg", "png"], 
});

// const storage = multer.diskStorage({
//     filename: function(req, file, cb){
//         cb(null, new Date().toISOString() + file.originalname);
//     }    

// });

// const fileFilter = (req, file, cb) => {
//     if(file.mimetype === "image/jpeg"){
//         cb(null, true);
//     } else {
//         cb(null, false);
//     }
// }

const upload = multer({
    storage: storage,
    // fileFilter: fileFilter
});



router.get("/", async (req, res, next) => {
    try {
        await Post.find()
        .select("email _id postText postImage")
        .exec()
        .then(post => {
            console.log(post.user.email);
            console.log(post);
            res.json(post);
        })
    }
    catch(err){
        next(err);
    }     
});

router.post("/", upload.single("postImage"),(req, res, next) => {
    // cloudinary.uploader.upload(req.file.path);
    const post = {};
    post.postText = req.body.postText;
    post.postImage = req.file;
    post.author.email = req.user.email;
    post.author.id = req.user._id;
    Post.create(post)
    .then(newPost => res.json(newPost))
    .catch(err => res.json({
        success: false,
        err
    }));
})


module.exports = router;
