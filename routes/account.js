var express = require("express");
var router = express.Router();
var controllers = require("../controllers");
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");

router.post("/login", function(req, res, next) {
  var formData = req.body; // email, pwd

  controllers.profile
    .get({ email: formData.email }, true)
    .then(function(profiles) {
      if (profiles.length == 0) {
        res.json({
          confirmation: "fail",
          message: "Profile not found."
        });
        return;
      }
      var profile = profiles[0];

      // password check first

      var passwordCorrect = bcrypt.compareSync(
        formData.password,
        profile.password
      );
      if (passwordCorrect == false) {
        req.session.reset();
        res.json({
          confirmation: "fail",
          message: "Incorrect Password."
        });

        return;
      }

      // add a key/id to the session
      req.session.user = profile._id.toString(); // attach session
      req.session.name = profile.username;
      req.session.token = jwt.sign(
        { id: profile._id.toString(), username: profile.username },
        process.env.TOKEN_SECRET, // stored in env variable - change this to globally reset all tokens when sec breached.
        {
          expiresIn: 4000
        }
      );
      res.redirect("/profile");
    })
    .catch(function(err) {
      res.json({
        confirmation: "fail",
        message: err
      });
    });
});

router.get("/currentuser", function(req, res, next) {
  if (req.session == null) {
    res.json({
      confirmation: "success",
      user: null,
      name: null
    });
    return;
  }

  if (req.session.token == null) {
    res.json({
      confirmation: "success",
      user: null,
      name: null
    });
    return;
  }

  jwt.verify(req.session.token, process.env.TOKEN_SECRET, function(
    err,
    decode
  ) {
    if (err) {
      req.session.reset();
      res.json({
        confirmation: "fail",
        message: "Invalid token"
      });
      return;
    }

    controllers.profile
      .findById(decode.id)
      .then(function(profile) {
        res.json({
          confirmation: "success",
          user: profile // this decoded obj = the assigned object in jwt.sign(param1, ...)
        });
      })
      .catch(function(err) {
        res.json({
          confirmation: "fail",
          message: err
        });
      });

    // res.json({
    //   confirmation: "success",
    //   token: decode // this decoded obj = the assigned object in jwt.sign(param1, ...)
    // });
  });
});

router.post("/register", function(req, res, next) {
  var formData = req.body;

  controllers.profile
    .post(formData)
    .then(function(profile) {
      console.log("\n\n --- WELCOME: " + profile.id);

      controllers.profile
        .findById(profile.id)
        .then(function(profile) {
          req.session.user = profile.id; // attach session
          req.session.name = profile.username;
          req.session.token = jwt.sign(
            { id: profile.id, username: profile.username },
            process.env.TOKEN_SECRET, // stored in env variable - change this to globally reset all tokens when sec breached.
            {
              expiresIn: 4000
            }
          );
          res.redirect("/profile");
        })
        .catch(function(err) {
          res.json({
            confirmation: "fail",
            message: err
          });
        });
    })
    .catch(function(err) {
      next(err);
    });
});

router.get("/logout", function(req, res, next) {
  console.log("Logged out -id: " + req.session.user);
  req.session.reset();
  res.redirect("/");

  //   res.json({
  //     confirmation: "success",
  //     user: null,
  //     name: null
  //   });
});

router.post("/delete", function(req, res, next) {
  //   console.log("\nDELETING ......... " + req.session.user);

  var formData = req.body;
  controllers.profile
    .findById(req.session.user, true)
    .then(function(profile) {
      //   console.log("DELETE - id = " + profile.id);
      //   console.log("DELETE - password = " + profile.password);

      var passwordCorrect = bcrypt.compareSync(
        formData.password,
        profile.password
      );
      if (passwordCorrect == true) {
        jwt.verify(req.session.token, process.env.TOKEN_SECRET, function(
          err,
          decode
        ) {
          if (err) {
            req.session.reset();
            res.json({
              confirmation: "fail",
              message: "Invalid token"
            });
            return;
          }
          controllers.profile
            .delete(decode.id)
            .then(function() {
              req.session.reset();
              res.redirect("/");
              // res.json({
              //   confirmation: "success",
              //   message: "User account: " + profile.email + " - deleted."
              // });
            })
            .catch(function(err) {
              res.json({
                confirmation: "fail",
                message: err
              });
            });
        });
        return;
      }
      res.json({
        confirmation: "fail",
        message: "Incorrect Password."
      });
    })
    .catch(function(err) {
      res.json({
        confirmation: "fail",
        message: "shit"
      });
    });
});

module.exports = router;
