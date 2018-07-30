const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
    username: String,
    password: String,
    avatar: {
        type: String,
        default: "https://thesocietypages.org/socimages/files/2009/05/vimeo.jpg"
    },
    firstName: String,
    lastName: String,
    email: String,
    isAdmin: {
        type: Boolean,
        default: false
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);