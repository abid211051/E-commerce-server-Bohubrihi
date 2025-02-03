const { User } = require("../models/user");
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;

const fbStrategy = new FacebookStrategy(
  {
    clientID: process.env.FACEBOOK_APP_ID,
    clientSecret: process.env.FACEBOOK_APP_SECRET,
    callbackURL: `${process.env.URL}/auth/facebook/callback`,
    profileFields: [
      "id",
      "displayName",
      "emails",
      "first_name",
      "middle_name",
      "last_name",
    ],
  },
  async (accessToken, refreshToken, profile, cb) => {
    try {
      const user = await User.findOne({ facebookid: profile.id });
      if (user) {
        const token = user.generateJWT();
        const response = {
          token: token,
          user: {
            _id: user._id,
            email: user.email,
            name: user.name,
          },
        };
        cb(null, response);
      } else {
        const newuser = new User({
          name: profile._json.name,
          email: profile._json.email,
          facebookid: profile.id,
        });
        await newuser.save();
        const token = newuser.generateJWT();
        const response = {
          token: token,
          user: {
            _id: newuser._id,
            email: newuser.email,
            name: newuser.name,
          },
        };
        cb(null, response);
      }
    } catch (error) {
      cb(error.message, "Failed");
    }
  }
);

passport.use(fbStrategy);
