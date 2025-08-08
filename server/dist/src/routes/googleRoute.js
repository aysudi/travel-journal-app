import express from "express";
import passport from "passport";
import config from "../config/config.js";
import { generateAccessToken } from "../utils/jwt.js";
const googleRouter = express.Router();
googleRouter.get("/google", passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
}));
googleRouter.get("/google/callback", passport.authenticate("google", {
    failureRedirect: `${config.CLIENT_URL}/auth/login?error=google_failed`,
    session: false,
}), (req, res) => {
    try {
        const user = req.user;
        if (!user) {
            throw new Error("User is not define");
        }
        const accessToken = generateAccessToken({
            id: user._id,
            email: user.email,
            fullName: user.fullName,
        }, "15m");
        res.redirect(`${config.CLIENT_URL}/auth/success/${accessToken}`);
    }
    catch (err) {
        res.redirect("/login?error=Something went wrong");
    }
});
export default googleRouter;
