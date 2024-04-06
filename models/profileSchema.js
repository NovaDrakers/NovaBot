const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userID: {type: String, require: true, unique: true},
    serverID: {type: String, require: true, unique: true},
    balance: {type:Number, default:1000},
    dailyLastUsed: {type: Number, default:0},
});

const model = mongoose.model("MemberData", profileSchema);

module.exports = model;