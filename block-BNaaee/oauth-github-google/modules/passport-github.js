var passport = require("passport");
var GitHubStrategy = require("passport-github2").Strategy;
var User = require("../models/User");

passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: "/auth/github/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      console.log(profile);
      var profileData = {
        name: profile._json.name,
        username: profile._json.login,
        email: profile._json.email,
        avatar: profile._json.avatar_url,
      };
      try {
        const user = await User.findOne({ email: profile._json.email });
        if (!user) {
          const addedUser = await User.create(profileData);
          return done(null, addedUser);
        }
        return done(null, user);
      } catch (error) {
        done(error);
      }
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
