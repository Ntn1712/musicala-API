const mongoose  = require("mongoose");
const bcrypt = require("bcrypt");
salt_factor = 8;

mongoose.set('useCreateIndex', true);

var userSchema = new mongoose.Schema({
    name : {
        type : String,
        required: true
    },
    email : {
        type : String,
        unique: true,
        required: true
    },
    phone: {
        type: Number,
        required: true   
    },
    address: {
        street: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true

        },
        country: {
            type: String,
            required: true
        }
    },
    role: {
        type: String,
        enum: ["artist", "teacher", "studio", "company", "school", "college", "band"],
        default: "artist"
    },
    genre: {
        type: String,
        enum: ["pop", "rock", "opera", "classical", "jazz", "hip hop"],
    },
    password: {
        type: String,
        required: true
    },
    followers: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        name: String,
    }],
    following: [{
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        name: String,
    }]
    // isVerified: {
    //     type: Boolean,
    //     default: false
    // },
    // following: [
    //     {
    //         user:{ 
    //             type: mongoose.Schema.Types.ObjectId, 
    //             ref: 'User' 
    //         },
    //     }

    // ],
    // followers: [
    //     {
    //         user:{ 
    //             type: Schema.ObjectId, 
    //             ref: 'User' 
    //         },
    //     }
    // ],
    // requests: [
    //     {
    //         user: {
    //             type: Schema.ObjectId,
    //             ref: 'User'
    //         }
    //     }
    // ]
    // followers: [{
    //     email: {
    //         type: String
    //     },
    //     name: {
    //         type: String
    //     },
    //     role: {
    //         type: String,
    //         enum: ["artist", "teacher", "studio", "company", "school", "college", "band"],
    //     }
    // }],
    // requests: [{
    //     email: {
    //         type: String,
    //     },
    //     name: {
    //         type: String
    //     },
    //     role: {
    //         type: String,
    //         enum: ["artist", "teacher", "studio", "company", "school", "college", "band"],
    //     }
    // }]
});

userSchema.methods.generateHash = password => {
    return bcrypt.hashSync(password, bcrypt.genSaltSync(salt_factor), null);
};

userSchema.methods.validPassword = password => {
    return bcrypt.compareSync(password,this.password);
};


module.exports = mongoose.model("User", userSchema);