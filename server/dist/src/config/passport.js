import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import config from "./config.js";
import { Strategy as GitHubStrategy, } from "passport-github2";
import UserModel from "../models/User.js";
passport.use(new GoogleStrategy({
    clientID: config.GOOGLE_CLIENT_ID,
    clientSecret: config.GOOGLE_CLIENT_SECRET,
    callbackURL: `${config.SERVER_URL}/auth/google/callback`,
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        if (!profile.id || !profile.emails?.length) {
            return done(new Error("Invalid Google profile"), false);
        }
        const existingUser = await UserModel.findOne({
            providerId: profile.id,
        });
        if (existingUser) {
            return done(null, existingUser);
        }
        const emailTaken = await UserModel.findOne({
            email: profile.emails?.[0].value,
        });
        if (emailTaken) {
            return done(null, false, {
                message: "Email is already used",
            });
        }
        const newUser = await UserModel.create({
            fullName: profile.displayName,
            username: `${profile.emails?.[0]?.value.split("@")[0]}-${Date.now()}`,
            email: profile.emails?.[0]?.value,
            profileImage: profile.photos?.[0]?.value,
            provider: "google",
            providerId: profile.id,
            isVerified: true,
            lastLogin: new Date(),
        });
        return done(null, newUser);
    }
    catch (error) {
        done(error, false);
    }
}));
passport.use(new GitHubStrategy({
    clientID: config.GITHUB_CLIENT_ID,
    clientSecret: config.GITHUB_CLIENT_SECRET,
    callbackURL: `${config.SERVER_URL}/auth/github/callback`,
    scope: ["user:email"],
}, async (_accessToken, _refreshToken, profile, done) => {
    try {
        if (!profile.id) {
            return done(new Error("Invalid GitHub profile"), false);
        }
        const existingUser = await UserModel.findOne({
            providerId: profile.id,
        });
        if (existingUser) {
            return done(null, existingUser);
        }
        const email = profile.emails?.find((e) => e.verified)
            ?.value || profile.emails?.[0]?.value;
        if (!email) {
            return done(new Error("No email found in GitHub profile"), false);
        }
        const emailTaken = await UserModel.findOne({ email });
        if (emailTaken) {
            return done(null, false, {
                message: "Email is already used",
            });
        }
        const newUser = await UserModel.create({
            fullName: profile.displayName || profile.username,
            username: `${profile.username}-${Date.now()}`,
            email,
            profileImage: profile.photos?.[0]?.value,
            provider: "github",
            providerId: profile.id,
            isVerified: true,
            lastLogin: new Date(),
        });
        return done(null, newUser);
    }
    catch (error) {
        return done(error, false);
    }
}));
passport.serializeUser((user, done) => {
    done(null, user._id);
});
passport.deserializeUser(async (id, done) => {
    try {
        const user = await UserModel.findById(id);
        done(null, user);
    }
    catch (error) {
        done(error, null);
    }
});
export default passport;
