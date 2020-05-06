var Profile = require("../Models/Profile");
var Promise = require("bluebird");
var bcrypt = require("bcryptjs");

module.exports = {
  get: function(params, isRaw) {
    return new Promise(function(resolve, reject) {
      if (isRaw == null) {
        isRaw = false;
      }

      Profile.find(params, function(err, profiles) {
        if (err) {
          reject(err);
          return;
        }

        if (isRaw == true) {
          resolve(profiles);
          return;
        }

        var results = [];
        profiles.forEach(function(profile, i) {
          results.push(profile.summary());
        });
        resolve(results);
      });
    });
  },

  post: function(body) {
    return new Promise(function(resolve, reject) {
      // check for existing username / email
      var username = body.username;
      var email = body.email;

      Profile.findOne({ email: new RegExp("^" + email + "$", "i") }, function(
        err,
        profile
      ) {
        if (profile != null) {
          reject(
            new Error("Email " + "'" + profile.email + "'" + " already taken.")
          );
          return;
        }
        Profile.findOne(
          { username: new RegExp("^" + username + "$", "i") },
          function(err, profile) {
            if (profile != null) {
              reject(
                new Error(
                  "Username " + "'" + profile.username + "'" + " already taken."
                )
              );
              return;
            }

            // hash password before sending to db
            var password = body.password;
            // check for empty password field
            if (password != (null, "")) {
              if (body["password"] == body["passwordVerify"]) {
                var password = body.password; // plain text pwd
                var hashed = bcrypt.hashSync(password, 10); // hashed
                body["password"] = hashed;

                Profile.create(body, function(err, profile) {
                  if (err) {
                    reject(err);
                    return;
                  }

                  resolve(profile.summary());
                });
                return;
              }

              reject(Error("C'mon man...Passwords do not match :("));
              return;
            }
            reject(Error("Password field cannot be empty."));
            return;
          }
        );
      });
    });
  },

  findById: function(id, isRaw) {
    return new Promise(function(resolve, reject) {
      if (isRaw == null) {
        isRaw = false;
      }

      Profile.findById(id, function(err, profile) {
        if (profile == null) {
          reject(
            new Error("Profile with id " + "'" + id + "'" + " does not exist.")
          );
          return;
        }
        if (err) {
          reject(err);
          return;
        }
        if (isRaw == true) {
          resolve(profile);
          return;
        }
        resolve(profile.summary());
      });
    });
  },

  findOne: function(username) {
    return new Promise(function(resolve, reject) {
      Profile.findOne(
        { username: new RegExp("^" + username + "$", "i") },
        function(err, profile) {
          if (profile == null) {
            reject(
              new Error("Username " + "'" + username + "'" + " not found")
            );
            return;
          }

          resolve(profile.summary());
        }
      );
    });
  },

  delete: function(id) {
    return new Promise((resolve, reject) => {
      Profile.findByIdAndDelete(id, function(err, profile) {
        if (err) {
          reject(err);
          return;
        }
        if (profile == null) {
          reject(
            new Error("Profile with id " + "'" + id + "'" + " does not exist.")
          );
          return;
        }
        resolve(profile.summary());
      });
    });
  }
};
