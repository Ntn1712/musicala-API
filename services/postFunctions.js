const Promise = require("bluebird");
const Post = require("../models/post");

module.exports.getPosts = () => {
    return new Promise((resolve, reject) => {
        try{
            Post.find({})
            .exec()
            .then(posts => {
                return resolve(posts);
            })
            .catch(err => reject(err));
        } catch(err){
            return reject(err);
        }
    });
};

module.exports.addPost = (postDetails) => {
    return new Promise((resolve, reject) => {
        try{
            let newPost = new Post({
                postText: req.body.postText,
                postImage: req.file.path 
            });
            newPost
            .save()
            .then(savedPost => resolve("ok"));
        }catch(error){
            console.log(error);
            return reject(error);
        }
    })
};

module.exports.deletePost = id => {
    return new Promise((resolve, reject) => {
        try{
            Post.find({
                _id: id
            })
            .exec()
            .then(post => {
                if(!post){
                    return reject(new Error("Post Does not Exist"))
                }
                post
                .remove()
                .then(() => resolve())
                .catch(err => reject(err));
            })
            .catch(err => reject(err));
        } catch(error){
            return reject(error);
        }
    })
}

module.exports.updatePost = postDetails => {
    return new Promise((resolve, reject) => {
        try {
            return Post.findByIdAndUpdate(
                postDetails._id,
                { $set: postDetails },
                { new: true }
            )
                .exec()
                .then(post => {
                    if (!post) {
                        return reject(new Error("Post not found"));
                    }
                    return resolve(post);
                })
                .catch(err => reject(err));
        } catch (error) {
            return reject(error);
        }
    });
};