const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require("../models/User");

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:8000/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value?.toLowerCase();
        const displayName = profile.displayName;
        const photo = profile.photos?.[0]?.value || null;

        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          if (email) {
            user = await User.findOne({ email });
          }

          if (!user && displayName) {
            user = await User.findOne({ username: displayName });
          }
        }

        if (user) {
          user.googleId = profile.id;
          if (photo) {
            user.photo = photo;
          }
          if (displayName && !user.username) {
            user.username = displayName;
          }
          await user.save();
        } else {
          let username = displayName;
          if (username && (await User.findOne({ username }))) {
            username = email?.split("@")[0] || `${displayName}-${profile.id.slice(-6)}`;
          }
          if (username && (await User.findOne({ username }))) {
            username = `${username}-${profile.id.slice(-6)}`;
          }

          user = await User.create({
            googleId: profile.id,
            email,
            username,
            photo,
          });
        }

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
