import { Request, Response, NextFunction } from "express";
import { IAuthRequest, User } from "../types";
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
  if (req.headers["x-auth"] == null) {
    return res.status(401).end();
  }
  // @ts-ignore
  req.auth = JSON.parse(req.headers["x-auth"] as string) as User;
  next();
}
