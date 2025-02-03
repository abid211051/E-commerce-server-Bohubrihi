const { User } = require("../models/user");
const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;

const Strategy = new GoogleStrategy(
  {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: `${process.env.URL}/auth/google/redirect`,
  },
  async (accessToken, refreshToken, profile, cb) => {
    console.log("EeEE");

    try {
      const user = await User.findOne({
        googleid: profile.id,
        email: profile._json.email,
      });

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
          googleid: profile.id,
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

passport.use(Strategy);
