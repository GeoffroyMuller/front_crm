import { Request, Response, NextFunction } from "express";
import { IAuthRequest, User } from "../types";
import jwt from "jsonwebtoken";
import * as fs from "fs";
import path from "path";

const PUBLIC_KEY = fs.readFileSync(
  path.join(__dirname, "../public.key.pub"),
  "utf8"
);

export type AuthRequest = IAuthRequest<User>;

export default async function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token =
    req.headers.authorization ||
    req.cookies.token ||
    (req.query.token as string);

  try {
    const payload = jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] });
    if (payload) {
      // @ts-ignore
      req["auth"] = payload;
      next();
    } else {
      res.cookie("token", "");
      res.status(401).end();
    }
  } catch (err) {
    console.log(err);
    res.cookie("token", "");
    res.status(401).end();
  }
}
