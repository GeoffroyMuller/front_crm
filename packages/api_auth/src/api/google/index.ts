import express from "express";
import userService from "../users/user.service";
import GoogleService from "./google.service";

const router = express.Router();

const callbackURL = `/auth/callback`;
const redirectURL = `${process.env.API_GATEWAY_URL}/google${callbackURL}`;

router.get("/auth/url", (req, res) => {
  const url = GoogleService.getGoogleAuthURL(redirectURL);
  res.json({ url });
});

router.get(callbackURL, async (req, res) => {
  try {
    const code = await GoogleService.getAccessTokenCodeFromGoogleCode(
      req.query.code as string,
      redirectURL
    );
    if (code != null) {
      res.redirect(`http://localhost:5173?access_code=${code}`);
    }
    res.status(401).end();
  } catch (err) {
    console.error(err);
    res.status(500).json();
  }
});

export default router;
