import { Response, NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

export function accessMiddlewareFactory(rights: string | Array<string>) {
  const rightsArray = Array.isArray(rights) ? rights : [rights];

  async function middleware(
    req: AuthRequest,
    res: Response,
    next: NextFunction
  ) {
    if (req.auth.role == null) {
      next();
    } else {
      try {
        const authRights =
          req.auth?.role?.rights != null
            ? req.auth?.role?.rights
            : [];
        for (const testedRight of rightsArray) {
          if (!authRights.includes(testedRight)) {
            return res.status(401).end();
          }
        }
        next();
      } catch (err) {
        console.error(err);
        return res.status(401).end();
      }
    }
  }
  return middleware;
}
