import { Request, Response } from "express";
import { AuthRequest } from "core_api/middlewares/auth.middleware";
import AuthService from "./auth.service";

async function getTokenFromCode(req: Request, res: Response) {
  try {
    const code = (req.query.code || req.body.code) as string;
    res.json({token: await AuthService.getTokenFromCode(code)});
  } catch (err) {
    res.status(401).end();
  }
}

async function login(req: Request, res: Response) {
  try {
    if (
      (typeof req.body.email === "string" &&
      typeof req.body.password === "string") ||
      typeof req.body.code === "string" || typeof req.body.refresh_token === "string"
    ) {
      res.json(
        await AuthService.login({
          email: req.body.email,
          password: req.body.password,
          code: req.body.code,
          refreshToken: req.body.refresh_token,
        })
      );
    } else {
      res.status(400).json({ message: "email or password not send" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err });
  }
}

async function register(req: Request, res: Response) {
  try {
    if (
      typeof req.body.email === "string" &&
      typeof req.body.password === "string"
    ) {
      res.json(await AuthService.register(req.body));
    } else {
      res.status(400).json({ message: "email or password not send" });
    }
  } catch (err) {
    res.status(500).json({ message: err });
  }
}

async function verify(req: AuthRequest, res: Response) {
  res.json(req["auth"]);
}

export default {
  login,
  register,
  verify,
  getTokenFromCode,
};
