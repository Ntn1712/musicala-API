var mongoose = require("mongoose");

var commentSchema = new mongoose.Schema({
    commentText: String,
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String,
        email: String
    },
});

module.exports = mongoose.model("Comment", commentSchema);