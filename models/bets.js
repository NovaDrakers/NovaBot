const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    userID: {type: String, require: true, unique: true},
    betID: {type: String, require: true},
    playerID: {type: String, require: true},
    betAmount: {type: String, require: true},
    betAmount: {type: String, require: true},

    
});

const model = mongoose.model("betData", profileSchema);

module.exports = model;