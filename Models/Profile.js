var mongoose = require("mongoose");

const ProfileSchema = new mongoose.Schema({
  email: { type: String, default: "" },
  username: { type: String, default: "" },
  password: { type: String, default: "" },
  timestamp: { type: Date, default: Date.now } // immutable timestamp object assigned when user signs up
});

ProfileSchema.methods.summary = function() {
  var summary = {
    id: this._id.toString(),
    email: this.email,
    username: this.username,
    timestamp: this.timestamp
  };

  return summary;
};

module.exports = mongoose.model("ProfileSchema", ProfileSchema, "Profiles");
