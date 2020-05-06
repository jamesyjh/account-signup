var Comment = require("../Models/Comment");
var Promise = require("bluebird");
var bcrypt = require("bcryptjs");

module.exports = {
  get: function(params) {
    return new Promise(function(resolve, reject) {
      Comment.find(params, function(err, comments) {
        if (err) {
          reject(err);
          return;
        }
        var results = [];
        comments.forEach(function(comment, i) {
          results.push(comment.summary());
        });
        resolve(results);
      });
    });
  },

  post: function(body) {
    return new Promise(function(resolve, reject) {
      // hash password before sending to db
      //   if (body.password != null) {
      //     var password = body.password; // plain text pwd
      //     var hashed = bcrypt.hashSync(password, 10); // hashed
      //     body["password"] = hashed;
      //   }
      Comment.create(body, function(err, comment) {
        if (err) {
          reject(err);
          return;
        }
        resolve(comment);
      });
    });
  },

  findById: function(id) {
    return new Promise(function(resolve, reject) {
      Comment.findById(id, function(err, comment) {
        if (err) {
          reject(err);
          return;
        }
        if (comment == null) {
          reject(
            new Error("Comment with id " + "'" + id + "'" + " does not exist.")
          );
          return;
        }
        resolve(comment);
      });
    });
  },

  findOne: function(username) {
    return new Promise(function(resolve, reject) {
      Comment.findOne(
        { username: new RegExp("^" + username + "$", "i") },
        function(err, comment) {
          if (comment == null) {
            reject(
              new Error("Username " + "'" + username + "'" + " not found")
            );
            return;
          }

          resolve(comment);
        }
      );
    });
  }
};
