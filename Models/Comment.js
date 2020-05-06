var mongoose = require("mongoose");

var CommentSchema = new mongoose.Schema({
  profile: { type: String, default: "" },
  text: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model("CommentSchema", CommentSchema);
