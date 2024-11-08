const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    flags: [{
        type: String,
    }],
    levelFinished: [{
        type: Boolean
    }],
    levels: [{
        type: Number
    }],
    finishTimes: {
        type: [Date],
        default: [null, null, null, null, null, null] 
    }
});

module.exports = mongoose.model("User", userSchema);
