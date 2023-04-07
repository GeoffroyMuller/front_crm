import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import * as fs from "fs";
import path from "path";

const PUBLIC_KEY = fs.readFileSync(
  path.join(__dirname, "../public.key.pub"),
  "utf8"
);


export default async function xAuthMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const token =
    req.headers?.authorization ||
    req.cookies?.token ||
    (req.query?.token as string);

  try {
    const payload = jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] });
    if (payload) {
      req.headers["x-auth"] = JSON.stringify(payload);
    } 
    next();
  } catch (err) {
    next();
  }
}
