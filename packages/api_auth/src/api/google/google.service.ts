import axios from "axios";
import authService from "../auth/auth.service";
import User from "../users/user.model";

export default {
  async getAccessTokenCodeFromGoogleCode(
    code: string,
    redirectURL: string
  ): Promise<string | undefined> {
    const token = await this.getAccessTokenFromCode(code, redirectURL);
    const userInfo = await this.getGoogleUserInfo(token);
    const user = await User.query().where("email", userInfo.email).first();
    if (user) {
      return await authService.generateAccessTokenCode(user);
    }
    return undefined;
  },
  async getGoogleUserInfo(access_token: string) {
    const response = await axios({
      url: "https://www.googleapis.com/oauth2/v2/userinfo",
      method: "get",
      headers: {
        Authorization: `Bearer ${access_token}`,
      },
    });
    return response.data;
  },
  async getAccessTokenFromCode(
    code: string,
    redirectURL: string
  ): Promise<string> {
    const response = await axios({
      url: `https://oauth2.googleapis.com/token`,
      method: "post",
      data: {
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectURL,
        grant_type: "authorization_code",
        code,
      },
    });
    return response.data.access_token;
  },
  getGoogleAuthURL(redirectURL: string): string {
    const params = [
      ["client_id", process.env.GOOGLE_CLIENT_ID],
      ["redirect_uri", redirectURL],
      [
        "scope",
        [
          "https://www.googleapis.com/auth/userinfo.email",
          "https://www.googleapis.com/auth/userinfo.profile",
        ].join(" "),
      ],
      ["response_type", "code"],
      ["access_type", "offline"],
      ["prompt", "consent"],
    ];
    const stringifiedParams = `?${params.map((p) => p.join("=")).join("&")}`;
    const url = new URL(
      `https://accounts.google.com/o/oauth2/v2/auth${stringifiedParams}`
    );
    return url.toString();
  },
};
