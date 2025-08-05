import express from "express";
import passport from "passport";
import config from "../config/config.js";
import { generateAccessToken } from "../utils/jwt.js";

const githubRouter = express.Router();

githubRouter.get(
  "/github",
  passport.authenticate("github", { scope: ["user:email"] })
);

githubRouter.get(
  "/github/callback",
  passport.authenticate("github", {
    session: false,
    failureRedirect: `${config.CLIENT_URL}/auth/login?error=github_failed`,
  }),
  async (req: any, res) => {
    try {
      const user = req.user;

      if (!user) {
        throw new Error("User is not define");
      }

      const accessToken = generateAccessToken(
        {
          id: user._id,
          email: user.email,
          fullName: user.fullName,
        },
        "15m"
      );

      res.redirect(`${config.CLIENT_URL}/auth/success/${accessToken}`);
    } catch (err) {
      res.redirect("/login?error=Something went wrong");
    }
  }
);

export default githubRouter;
