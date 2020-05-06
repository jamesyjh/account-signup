var express = require("express");
var app = express();
var createError = require("http-errors");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var sessions = require("client-sessions");
var mongoose = require("mongoose");
require("dotenv").config();


var routes = require("./routes/index");
var accountRouter = require("./routes/account");
var apiRouter = require("./routes/api");
// var profileRouter = require("./routes/profile");


const connectionString = process.env.CONNECTION_STRING

var db = mongoose.connection

db.once("open", () => {
  console.log('Database Connected: ', db.port, db.name)

})

db.on('error', err => {
  console.error('Connection Error: ', err)
})

mongoose.connect(connectionString, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(client => {
        // console.log("Connected to Database: ")
      

        // view engine setup
        app.set("views", path.join(__dirname, "views"));
        app.set("view engine", "hjs");

        app.use(logger("dev"));
        app.use(express.json());
        app.use(express.urlencoded({ extended: false }));
        app.use(cookieParser());
        app.use(
          sessions({
            cookieName: "session",
            duration: 24 * 60 * 60 * 1000,
            secret: process.env.SESSION_SECRET, // safety mech pwd to kill all active sessions - should be stored in environment variable
            activeDuration: 30 * 60 * 1000
          })
        );
        app.use(express.static(path.join(__dirname, "public")));

        app.use("/", routes);
        app.use("/api", apiRouter);
        app.use("/account", accountRouter);
        // app.use("/profiles", profileRouter);

        // catch 404 and forward to error handler
        app.use(function(req, res, next) {
          next(createError(404));
        });

        // error handler
        app.use(function(err, req, res, next) {
          // set locals, only providing error in development
          res.locals.message = err.message;
          res.locals.error = req.app.get("env") === "development" ? err : {};

          // render the error page
          res.status(err.status || 500);
          res.render("error");
        });


    })
    .catch(err => {
        console.error(err)
    })







module.exports = app;
