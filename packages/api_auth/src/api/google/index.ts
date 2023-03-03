import express from "express";
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
    const token = await GoogleService.getAccessTokenFromCode(
      req.query.code as string,
      redirectURL
    );
    const userInfo = await GoogleService.getGoogleUserInfo(token);
    res.json(userInfo);
  } catch (err) {
    console.error(err);
    res.status(500).json();
  }
});

export default router;
