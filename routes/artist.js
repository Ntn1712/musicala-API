const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/user");
const Post = require("../models/post");
const Comment = require("../models/comment");
const Event = require("../models/event");

mongoose.set('useFindAndModify', false);

var NodeGeocoder = require('node-geocoder'); 
var options = {
  provider: 'opencage',
  httpAdapter: 'https',
  apiKey: process.env.OCD_API_KEY,
  formatter: null
};

var geocoder = NodeGeocoder(options);


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
    allowedFormats: ["jpg", "png", ""],
});

const upload = multer({
    storage: storage,
    // fileFilter: fileFilter
});

//=============================================================================

// Posts

//=============================================================================

router.get("/:idd", async (req, res, next) => {
    try {
        var idd = req.path;
        idd = idd.split("/");
        idd = idd[2];
        console.log(idd);
        await Post.find()
            .then(post => {
                console.log(post);
                return res.json(post);
            })
            .catch(err => {
                console.log(err)
                return res.json({
                    msg: "Post not found"
                });
            });
    } catch (err) {
        next(err);
    }
});

//add posts

router.post("/:idd", upload.single("postImage"), async (req, res, next) => {
    try {
        var idd = req.path;
        idd = idd.split("/");
        idd = idd[2];
        console.log(idd);
        // User.findById(idd)
        await User.find({
            _id: idd,
        })
            .then(user => {
                // console.log(user);
                const post = {};
                console.log(req.body);
                post.postText = req.body.postText;
                post.postImage = req.file;
                Post.create(post)
                    .then(newPost => {
                        console.log(user);
                        newPost.author.email = user[0].email;
                        newPost.author.id = user[0]._id;
                        newPost.author.name = user[0].name;
                        newPost.save();
                        res.json(newPost);
                        // res.redirect("/artist/" + req.user.idd);
                    })
                    .catch(err => {
                        console.log(err);
                        next(err);
                    });
            })
            .catch(err => res.json(err));
    } catch (err) {
        console.log(err);
        next(err);
    }
});

//show complete data of post

router.get("/:idd/post/:iddd", async (req, res, next) => {
    try {
        var iddd = req.path;
        iddd = iddd.split("/");
        iddd = iddd[4];
        console.log(iddd);
        await Post.find({
            _id: iddd
        })
            .then(post => {
                console.log(post);
                res.json(post);
            })
    } catch (err) {
        console.log(err);
        next(err);
    }
})

//remove the post of particular id

router.delete("/:idd/post/:iddd", async (req, res, next) => {
    try {
        var iddd = req.path;
        iddd = iddd.split("/");
        iddd = iddd[4];
        console.log(iddd);
        await Post.find({
            _id: iddd
        })
            .then(ppost => {
                console.log(ppost[0].postImage.public_id);
                cloudinary.uploader.destroy(ppost[0].postImage.public_id, () => {
                    console.log("post deleted from cloudinary");
                })
            });
        await Post.findByIdAndRemove({
            _id: iddd,
        })
            .then(post => {
                if (!post) {
                    res.json({ message: "post does not exist" });
                }
                res.json({ message: "post deleted successfully" });

            })
            .catch(err => next(err));
    } catch (err) {
        console.log(err);
        next(err);
    }
});

//update the post of particular id

router.put("/:idd/post/:iddd", upload.single("postImage"), async (req, res, next) => {
    try {
        var iddd = req.path;
        iddd = iddd.split("/");
        iddd = iddd[4];
        console.log(iddd);
        await Post.findByIdAndUpdate({
            _id: iddd
        })
            .then(updatedPost => {
                console.log(updatedPost);
                updatedPost.postText = req.body.postText,
                    updatedPost.postImage = req.file;
                updatedPost.save();
                if (!updatedPost) {
                    res.json({ message: "post does not exist" });
                }
                res.json({
                    message: "post updated succesfully",
                    updatedPost
                })
            })
            .catch(err => {
                next(err);
                console.log(err);
            })
    } catch (err) {
        next(err);
        console.log(err);
    }
});


// =================================================
// follow and unfollow routes
// =================================================


router.post("/:idd/user/:id/follow", async (req, res, next) => {
    try {
        var id = req.path;
        id = id.split("/");
        id = id[4];
        var idd = req.path;
        idd = idd.split("/");
        idd = idd[2];
        await User.find({
            _id: idd
        })
            .then(async users => {
                await User.find({
                    _id: id
                })
                    .then(user => {
                        user[0].followers.push({
                            'id': users[0]._id,
                            'name': users[0].name
                        });
                        users[0].following.push({
                            'id': user[0]._id,
                            'name': user[0].name
                        });
                        user[0].save();
                        users[0].save();
                        res.json({
                            user,
                            users
                        })
                    })
                    .catch(err => {
                        console.log(err);
                        res.json({
                            success: false,
                            message: "user cannot be followed"
                        })
                    })
            })
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.post("/:idd/user/:id/unfollow", async (req, res, next) => {
    try {
        var id = req.path;
        id = id.split("/");
        id = id[4];
        var idd = req.path;
        idd = idd.split("/");
        idd = idd[2];
        await User.find({
            _id: idd
        })
            .then(async users => {
                await User.find({
                    _id: id
                })
                    .then(user => {
                        user[0].followers.pop({
                            'id': users[0]._id,
                            'name': users[0].name
                        });
                        users[0].following.pop({
                            'id': user[0]._id,
                            'name': user[0].name
                        });
                        user[0].save();
                        users[0].save();
                        res.json({
                            user,
                            users
                        });
                    })
                    .catch(err => {
                        console.log(err);
                        res.json({
                            success: false,
                            message: 'unsuccessfull unfollow'
                        })
                    })
            })
    } catch (err) {
        console.log(err);
        next(err);
    }
});


// =============================
// Like post
// =============================

router.post("/:idd/post/:id/like", async (req, res, next) => {
    try {
        var idd = req.path;
        idd = idd.split("/");
        idd = idd[2];
        var id = req.path;
        id = id.split("/");
        id = id[4];
        await Post.find({
            _id: id
        })
            .then(async foundPost => {
                await User.find({
                    _id: idd
                })
                    .then(user => {
                        var foundUserLike = foundPost[0].likes.some(like => {
                            return like.id.equals(user[0]._id);
                        });
                        if (foundUserLike) {
                            foundPost[0].likes.pop({
                                'id': user[0]._id,
                                'name': user[0].name,
                                'email': user[0].email
                            });
                        } else {
                            foundPost[0].likes.push({
                                'id': user[0]._id,
                                'name': user[0].name,
                                'email': user[0].email
                            });
                        }
                        foundPost[0].save();
                        res.json(foundPost);
                    })
                    .catch(err => {
                        console.log(err);
                        res.json({
                            success: false,
                            message: "Cannot save the post",
                        })
                    })
            })
    } catch (err) {
        console.log(err);
        next(err);
    }
});

// ==============================
// comments routes Post
// ==============================

router.post("/:idd/post/:id/comment", async (req, res, next) => {
    try {
        var idd = req.path;
        idd = idd.split("/");
        idd = idd[2];
        var id = req.path;
        id = id.split("/");
        id = id[4];
        await User.find({
            _id: idd
        })
            .then(async user => {
                await Post.find({
                    _id: id
                })
                    .then(post => {
                        const comment = {};
                        console.log(req.body.commentText);
                        comment.commentText = req.body.commentText;
                        Comment.create(comment)
                            .then(comment => {
                                comment.author.email = user[0].email;
                                comment.author.id = user[0]._id;
                                comment.author.name = user[0].name;
                                console.log(comment);
                                comment.save();
                                post[0].comments.push({
                                    'id': comment._id,
                                    'commentText': comment.commentText,
                                    'author': {
                                        'id': user[0]._id,
                                        'email': user[0].email,
                                        'name': user[0].name
                                    }
                                });
                                console.log(post[0].comments);
                                post[0].save();
                                res.json({
                                    comment,
                                    post
                                })
                            })
                            .catch(err => {
                                res.json(err);
                            })

                    })
                    .catch(err => {
                        res.json(err);
                    })
            })
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.post("/:idd/post/:id/comment/:iddd", async (req, res, next) => {
    var id = req.path;
    id = id.split("/");
    id = id[4];
    var iddd = req.path;
    iddd = iddd.split("/");
    iddd = iddd[6];
    await Post.find({
        _id: id
    })
        .then(async post => {
            await Comment.find({
                _id: iddd
            })
                .then(comment => {
                    post[0].comments.pop(comment[0]);
                    console.log(post[0]);
                    res.json(post[0]);
                })
            await Comment.findByIdAndRemove({
                _id: iddd
            })
                .then(() => {
                    res.json(post[0]);
                })
                .catch(err => {
                    console.log(err);
                    res.json(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

router.put("/:idd/post/:id/comment/:iddd", async (req, res, next) => {
    try {
        var id = req.path;
        id = id.split("/");
        id = id[4];
        var iddd = req.path;
        iddd = iddd.split("/");
        iddd = iddd[6];
        await Comment.findByIdAndUpdate({
            _id: iddd
        })
            .then(comment => {
                comment.commentText = req.body.commentText;
                comment.save();
                res.json(comment);
            })
            .catch(err => {
                console.log(err);
                res.json(err);
            })
    } catch (err) {
        console.log(err);
        next(err);
    }
});


//===========================
// genre sorting
//===========================

router.get("/:id/search", async (req, res, next) => {
    try {
        await User.find({
            genre: req.body.genre
        })
            .then(user => {
                console.log(user);
                res.json(user);
                return user;
            })
            // .then(async users => {
            //     const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            //     console.log("====================");
            //     console.log(users);
            //     console.log("================");
            //     console.log(users.find({
            //         name: regex
            //     }));
            //     console.log("======hlro");
            //     if(req.query.search){

            //         console.log(regex);
            //         console.log(req.query.search);
            //         await users.find({
            //             name: regex
            //         })
            //         .then(userse => {
            //             if(userse.length < 1){
            //                 res.json({
            //                     message: "No user found"
            //                 })
            //             }
            //             res.json(userse); 
            //         })
            //         .catch(err => {
            //             console.log(err);
            //             res.json(err);
            //         })
            //     } else {
            //     console.log(userse);
            //     res.json(userse);
            // }
            // })
            .catch(err => {
                console.log(err);
                res.json(err);
            })
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.get("/:id/search/user", async (req, res, next) => {
    const regex = new RegExp(escapeRegex(req.query.search), 'gi');
    if (req.query.search) {
        console.log(regex);
        console.log(req.query.search);
        await User.find({
            name: regex
        })
            .then(userse => {
                if (userse.length < 1) {
                    res.json({
                        message: "No user found"
                    })
                }
                res.json(userse);
            })
            .catch(err => {
                console.log(err);
                res.json(err);
            })
    } else {
        console.log(userse);
        res.json(userse);
    }
});


//===========================================

// EVents routes

//===========================================

router.post("/:idd/event", upload.single("eventImage"), async (req, res, next) => {
    try {
        var idd = req.path;
        idd = idd.split("/");
        idd = idd[2];
        console.log(idd);
        await User.find({
            _id: idd,
        })
            .then(user => {
                geocoder.geocode(req.body.eventLocation)
                .then(data => {
                    if(!data.length){
                        res.json({
                            msg: "data not complete"
                        })
                    }
                    const event = {};
                    console.log(req.body);
                    event.lat = data[0].latitude;
                    event.lng = data[0].longitude;
                    event.eventText = req.body.postText;
                    event.eventDate = req.body.eventDate;
                    event.eventLocation = req.body.eventLocation;
                    event.eventImage = req.file;
                    Event.create(event)
                        .then(newEvent => {
                            console.log(user);
                            newEvent.author.email = user[0].email;
                            newEvent.author.id = user[0]._id;
                            newEvent.author.name = user[0].name;
                            newEvent.save();
                            res.json(newEvent);
                            //res.redirect("/artist/" + user[0]._id);
                    })
                    .catch(err => {
                        console.log(err);
                        res.json(err);
                    });

                })
                .catch(err => {
                    console.log(err);
                    res.json(err);
                })
            })
            .catch(err => {
                console.log(err); 
                res.json(err)
            });
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.get("/:idd/event/:iddd", async (req, res, next) => {
    try {
        var iddd = req.path;
        iddd = iddd.split("/");
        iddd = iddd[4];
        console.log(iddd);
        await Event.find({
            _id: iddd
        })
            .then(event => {
                console.log(event);
                res.json(event);
            })
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.delete("/:idd/event/:iddd", async (req, res, next) => {
    try {
        var iddd = req.path;
        iddd = iddd.split("/");
        iddd = iddd[4];
        console.log(iddd);
        await Event.find({
            _id: iddd
        })
            .then(event => {
                console.log(event[0].eventImage.public_id);
                cloudinary.uploader.destroy(event[0].eventImage.public_id, () => {
                    console.log("post deleted from cloudinary");
                })
            });
        await Event.findByIdAndRemove({
            _id: iddd,
        })
            .then(event => {
                if (!event) {
                    res.json({ message: "post does not exist" });
                }
                res.json({ message: "post deleted successfully" });

            })
            .catch(err => next(err));
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.put("/:idd/event/:iddd", upload.single("postImage"), async (req, res, next) => {
    try {
        var iddd = req.path;
        iddd = iddd.split("/");
        iddd = iddd[4];
        console.log(iddd);
        await Event.findByIdAndUpdate({
            _id: iddd
        })
            .then(event => {
                console.log(event);
                event.eventText = req.body.eventText,
                event.postImage = req.file;
                event.save();
                if (!event) {
                    res.json({ message: "post does not exist" });
                }
                res.json({
                    message: "post updated succesfully",
                    event
                })
            })
            .catch(err => {
                next(err);
                console.log(err);
            })
    } catch (err) {
        next(err);
        console.log(err);
    }
});

//============
// Like event
//============

router.post("/:idd/event/:id/like", async (req, res, next) => {
    try {
        var idd = req.path;
        idd = idd.split("/");
        idd = idd[2];
        var id = req.path;
        id = id.split("/");
        id = id[4];
        await Event.find({
            _id: id
        })
            .then(async event => {
                await User.find({
                    _id: idd
                })
                    .then(user => {
                        var foundUserLike = event[0].likes.some(like => {
                            return like.id.equals(user[0]._id);
                        });
                        if (foundUserLike) {
                            event[0].likes.pop({
                                'id': user[0]._id,
                                'name': user[0].name,
                                'email': user[0].email
                            });
                        } else {
                            event[0].likes.push({
                                'id': user[0]._id,
                                'name': user[0].name,
                                'email': user[0].email
                            });
                        }
                        event[0].save();
                        res.json(event);
                    })
                    .catch(err => {
                        console.log(err);
                        res.json({
                            success: false,
                            message: "Cannot save the post",
                        })
                    })
            })
    } catch (err) {
        console.log(err);
        next(err);
    }
});

//======================
// event comments
//=======================

router.post("/:idd/event/:id/comment", async (req, res, next) => {
    try {
        var idd = req.path;
        idd = idd.split("/");
        idd = idd[2];
        var id = req.path;
        id = id.split("/");
        id = id[4];
        await User.find({
            _id: idd
        })
            .then(async user => {
                await Event.find({
                    _id: id
                })
                    .then(event => {
                        const comment = {};
                        console.log(req.body.commentText);
                        comment.commentText = req.body.commentText;
                        Comment.create(comment)
                            .then(comment => {
                                comment.author.email = user[0].email;
                                comment.author.id = user[0]._id;
                                comment.author.name = user[0].name;
                                console.log(comment);
                                comment.save();
                                event[0].comments.push({
                                    'id': comment._id,
                                    'commentText': comment.commentText,
                                    'author': {
                                        'id': user[0]._id,
                                        'email': user[0].email,
                                        'name': user[0].name
                                    }
                                });
                                console.log(event[0].comments);
                                event[0].save();
                                res.json({
                                    comment,
                                    event
                                })
                            })
                            .catch(err => {
                                console.log(err);
                                res.json(err);
                            })
                    })
                    .catch(err => {
                        console.log(err);
                        res.json(err);
                    })
            })
    } catch (err) {
        console.log(err);
        next(err);
    }
});

router.post("/:idd/event/:id/comment/:iddd", async (req, res, next) => {
    var id = req.path;
    id = id.split("/");
    id = id[4];
    var iddd = req.path;
    iddd = iddd.split("/");
    iddd = iddd[6];
    await Event.find({
        _id: id
    })
        .then(async event => {
            await Comment.find({
                _id: iddd
            })
                .then(comment => {
                    event[0].comments.pop(comment[0]);
                    console.log(event[0]);
                    res.json(event[0]);
                })
            await Comment.findByIdAndRemove({
                _id: iddd
            })
                .then(() => {
                    res.json(event[0]);
                })
                .catch(err => {
                    console.log(err);
                    res.json(err);
                })
        })
        .catch(err => {
            console.log(err);
            res.json(err);
        })
});

router.put("/:idd/event/:id/comment/:iddd", async (req, res, next) => {
    try {
        var id = req.path;
        id = id.split("/");
        id = id[4];
        var iddd = req.path;
        iddd = iddd.split("/");
        iddd = iddd[6];
        await Comment.findByIdAndUpdate({
            _id: iddd
        })
            .then(comment => {
                comment.commentText = req.body.commentText;
                comment.save();
                res.json(comment);
            })
            .catch(err => {
                console.log(err);
                res.json(err);
            })
    } catch (err) {
        console.log(err);
        next(err);
    }
});



function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};


module.exports = router;