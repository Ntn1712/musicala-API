const mongoose = require("mongoose");

var eventSchema = new mongoose.Schema({
    eventText: {
        type: String
    },
    eventImage: {
        type: Object,
    },
    eventDate: {
        type: Date,
        default: Date.now
    },
    lat: {
        type: String
    },
    lng: {
        type: String
    },
    eventPostDate: {
        type: Date,
        default: Date.now
    },
    eventLocation: {
        type: String,
        required: true
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
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        email: String,
        name: String
    }
})

module.exports = mongoose.model("Event", eventSchema);