var passport = require("passport");
var User = require("../models/User");
var LocalStrategy = require("passport-local");

passport.use(
  new LocalStrategy(function verify(email, password, done) {
    try {
      if (!email || !password) {
        return done(null, false, {
          message: "Incorrect username or password.",
        });
        done(err);
      }
      User.findOne({ email: email }, (err, user) => {
        if (err) return next(err);
        if (!user) {
          console.log("No user found");
          return done(null, false, {
            message: "Incorrect username or password.",
          });
        }
        user.verifyPassword(password, (err, isMatch) => {
          if (err) return next(err);
          if (!isMatch) {
            return res.redirect("/users/login");
          } else {
            req.session.userId = user.id;
            return done(null, row);
          }
        });
      });
    } catch (err) {
      done(err);
    }
  })
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});
