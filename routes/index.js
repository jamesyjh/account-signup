var express = require("express");
var router = express.Router();
var jwt = require("jsonwebtoken");
var controllers = require("../controllers");

/* GET home page. */
router.get("/", function(req, res, next) {
  res.render("index", { title: "Express", header: "Welcome" });
});

router.get("/profile", function(req, res, next) {
  if (req.session == null) {
    res.render("profile", null);
    return;
  }

  if (req.session.token == null) {
    res.render("profile", null);

    return;
  }
  jwt.verify(req.session.token, process.env.TOKEN_SECRET, function(
    err,
    decode
  ) {
    if (err) {
      res.render("profile", null);
      return;
    }

    controllers.profile
      .findById(decode.id)
      .then(function(profile) {
        res.render("profile", profile);
      })
      .catch(function(err) {
        res.render("profile", null);
      });
  });
  // res.render("profile", null);
});

module.exports = router;
