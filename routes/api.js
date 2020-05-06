var express = require("express");
var router = express.Router();
var Profile = require("../Models/Profile");
var controllers = require("../controllers");


router.post("/:resource", function(req, res, next) {
  var resource = req.params.resource;
  //   var controller = controllers[resource];
  if (controller == null) {
    res.json({
      confirmation: "fail",
      message: "Resource " + resource + " not supported."
    });
    return;
  }
  var formData = req.body;

  controllers.profile
    .post(formData)
    .then(function(profile) {
      res.json({
        confirmation: "success",
        result: profile
      });
    })
    .catch(function(err) {
      res.json({
        confirmation: "fail",
        message: err
      });
    });

  res.json({
    confirmation: "fail",
    message: "Resource " + "'" + resource + "'" + " not supported."
  });
});

router.get("/:resource", function(req, res, next) {
  var resource = req.params.resource;
  var controller = controllers[resource];
  // specify resource type from url
  if (controller == null) {
    res.json({
      confirmation: "fail",
      message: "Resource " + "'" + resource + "'" + " not supported."
    });
    return;
  }

  controller
    .get(null)
    .then(function(results) {
      res.json({
        confirmation: "success",
        results: results
      });
    })

    .catch(function(err) {
      res.json({
        confirmation: "fail",
        message: err
      });
    });
});

router.get("/:resource/:type/:username", function(req, res, next) {
  var resource = req.params.resource;
  var type = req.params.type;
  var username = req.params.username;

  if (resource == "profile" && type == "user") {
    controllers.profile
      .findOne(username)
      .then(function(profile) {
        res.json({
          confirmation: "success",
          result: profile
        });
      })
      .catch(function(err) {
        res.json({
          confirmation: "fail",
          message: "Username " + "'" + username + "'" + " not found"
        });
      });

    return;
  }
  if (resource == "profile" && type == "id") {
    var id = username;

    controllers.profile
      .findById(id)
      .then(function(profile) {
        res.json({
          confirmation: "success",
          result: profile
        });
      })

      .catch(function(err) {
        res.json({
          confirmation: "fail",
          message: "User with id " + "'" + id + "'" + " does not exist"
        });
      });
    return;
  }

  res.json({
    confirmation: "fail",
    message: "Invalid resource type " + "'" + type + "'."
  });
});

module.exports = router;
