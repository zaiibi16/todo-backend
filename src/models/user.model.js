const mongoose = require("mongoose");
const Userschema = mongoose.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
    },
    created: {
        type: Date,
        default: Date.now(),
    }
});

const User = mongoose.model("User", Userschema);
module.exports = User;