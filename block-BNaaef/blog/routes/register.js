var express = require("express");
var router = express.Router();
var Register = require("../models/Register");
var passport = require("passport");
var { ensureAuthenticated } = require("../config/auth.js");
var passportGoogle = require("../modules/google");
var passportGitHub = require("../modules/github");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("register");
});

router.get("/login", function (req, res, next) {
  var error = req.flash("error")[0];
  console.log(error);
  res.render("login", { error });
});

router.post("/", (req, res, next) => {
  console.log(req.body);
  Register.create(req.body, (err, register) => {
    if (err) return next(err);
    res.redirect("/register/login");
  });
});

router.post("/login", (req, res, next) => {
  var { email, password } = req.body;
  if (!email || !password) {
    req.flash("error", "Email/Password required!");
    return res.redirect("/register/login");
  }
  Register.findOne({ email }, (err, register) => {
    if (err) return next(err);
    if (!register) {
      req.flash("error", "Email is not registered");
      return res.redirect("/register/login");
    }
    register.verifyPassword(password, (err, result, data) => {
      if (err) return next(err);
      if (!result) {
        req.flash("error", "Invalid password!");
        return res.redirect("/register/login");
      }
      req.session.registerId = register.id;
      res.render("article", { data });
    });
  });
});

router.get("/logout", (req, res, next) => {
  req.session.destroy();
  res.clearCookie("connect.sid");
  res.redirect("/");
});

router.get("/articles", ensureAuthenticated, (req, res) => {
  console.log(req);
  res.render("article", {
    user: req.user,
  });
});

/* GOOGLE ROUTER */
router.get(
  "/google",
  passportGoogle.authenticate("google", {
    scope: "https://www.google.com/m8/feeds",
  })
);

router.get(
  "/google/callback",
  passportGoogle.authenticate("google", { failureRedirect: "/login" }),
  function (req, res) {
    res.redirect("/article");
  }
);

/* GITHUB ROUTER */
router.get("/github", passportGitHub.authenticate("github"));

router.get(
  "/github/callback",
  passportGitHub.authenticate("github", { failureRedirect: "/login" }),
  function (req, res) {
    // Successful authentication, redirect home.
    res.redirect("/article");
  }
);

module.exports = router;
