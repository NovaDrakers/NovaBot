const mongoose = require("mongoose");

const profileSchema = new mongoose.Schema({
    betID: {type: String, require: true, unique: true},
    firstPlayerID: {type: String, require: true},
    secondPlayerID: {type: String, require: true},
});

const model = mongoose.model("LineData", profileSchema);

module.exports = model;