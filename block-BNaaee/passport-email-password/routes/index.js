var express = require("express");
var router = express.Router();

router.post(
  "/login/password",
  passport.authenticate("local", {
    successReturnToOrRedirect: "/",
    failureRedirect: "/login",
    failureMessage: true,
  })
);

router.post("/logout", function (req, res, next) {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
});

router.get("/signup", function (req, res, next) {
  res.render("signup");
});

router.get("/login", function (req, res, next) {
  res.render("login");
});

router.post("/signup", function (req, res, next) {
  User.create(req.body, (err, user) => {
    if (err) return next(err);
    console.log(user.getFullName(firstName, lastName));
    var user = {
      id: user._id,
      email: user.email,
    };
    req.login(user, function (err) {
      if (err) {
        return next(err);
      }
      res.redirect("/");
    });
  });
});
module.exports = router;
