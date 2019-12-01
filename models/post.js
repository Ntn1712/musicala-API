const mongoose = require("mongoose");

var postSchema = new mongoose.Schema({
    postText: {
        type: String
    },
    postImage: {
        type: Object
    },
    postDate: {
        type: Date,
        default: Date.now
    },
    likes: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        name: String,
        email: String
    }],
    comments: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
        },
        commentText: String,
        author: {
            id : {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User"
            },
            name: String,
            email: String
        }
    }],
    // postVideo: {
    //     type: String
    // },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        email: String,
        name: String
    }
});

module.exports = mongoose.model("Post", postSchema);