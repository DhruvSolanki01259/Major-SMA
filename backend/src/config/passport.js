import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as TwitterStrategy } from "passport-twitter-oauth2";
import { User } from "../models/user.model.js";
import { generateInitials } from "../utils/generateInitials.js";
import { encryptToken } from "../utils/encryption.js";
import "dotenv/config";

passport.serializeUser((user, done) => {
  done(null, user._id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          user = await User.findOne({ email: profile.emails[0].value });

          if (user) {
            user.googleId = profile.id;
            user.avatar = profile.photos[0].value;
            await user.save();
          } else {
            user = await User.create({
              fullname: profile.displayName,
              email: profile.emails[0].value,
              googleId: profile.id,
              avatar: profile.photos[0].value,
              profile_initials: generateInitials(profile.displayName),
              lastLogin: new Date(),
            });
          }
        } else {
          user.lastLogin = new Date();
          user.avatar = profile.photos[0].value;
          await user.save();
        }

        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

passport.use(
  new TwitterStrategy(
    {
      clientID: process.env.TWITTER_CLIENT_ID,
      clientSecret: process.env.TWITTER_CLIENT_SECRET,
      callbackURL: "http://localhost:8000/api/auth/twitter/callback",
      passReqToCallback: true,
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const userId = req.session?.tempUserId;
        
        if (!userId) {
          return done(new Error("Authentication session expired. Please try connecting again."), null);
        }

        const user = await User.findById(userId);
        if (!user) {
          return done(new Error("User not found"), null);
        }

        user.socialConnections.twitter = {
          accessToken: encryptToken(accessToken),
          refreshToken: encryptToken(refreshToken),
          profileId: profile.id,
          username: profile.username || profile.displayName,
          connectedAt: new Date(),
        };

        await user.save();
        return done(null, user);
      } catch (error) {
        return done(error, null);
      }
    }
  )
);

export default passport;
