var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var GitHubStrategy = require("passport-github").Strategy;
var GoogleStrategy = require("passport-google-oauth").OAuth2Strategy;
var bcrypt = require("bcrypt");
var User = require("../models/User");

passport.use(
  new LocalStrategy({ usernameField: "email" }, (email, password, done) => {
    //match user
    User.findOne({ email: email })
      .then((user) => {
        if (!user) {
          return done(null, false, {
            message: "that email is not registered",
          });
        }
        //match pass
        bcrypt.compare(password, user.password, (err, isMatch) => {
          if (err) throw err;

          if (isMatch) {
            return done(null, user);
          } else {
            return done(null, false, { message: "pass incorrect" });
          }
        });
      })
      .catch((err) => {
        console.log(err);
      });
  })
);

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOrCreate(
        { userid: profile.id },
        { name: profile.displayName, userid: profile.id },
        function (err, user) {
          return done(err, user);
        }
      );
    }
  )
);
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
    },
    function (accessToken, refreshToken, profile, done) {
      User.findOrCreate(
        { userid: profile.id },
        { name: profile.displayName, userid: profile.id },
        function (err, user) {
          return done(err, user);
        }
      );
    }
  )
);

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

module.exports = passport;
