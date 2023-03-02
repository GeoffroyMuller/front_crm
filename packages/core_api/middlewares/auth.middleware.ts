import { Request, Response, NextFunction } from "express";
import { IAuthRequest, User } from "../types";
import jwt from "jsonwebtoken";

const PUBLIC_KEY = '-----BEGIN PUBLIC KEY-----\n' +
'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhsQqeMlUI+SYWF88ERBS\n' +
'QT+h/Xj3Tmjc5mdR8n+ww83/MNMtXUbCJ3BHkwx9/DDpKmhjLz9cfmoc6xjckhbG\n' +
'3No79rHI4uoMgCObJi/rKS5Kp/+kAdRZkgm/VvW+63e8ZsrH4r3doj5APe0+ThP3\n' +
'BrI1kz09RKTdXWFigGcwVLYDqtFI4O2wZJyp4zGyV+wMBebPqeL+XNA/TnyiF13y\n' +
'OgG4ZUBePH1feppi+3vVm5RwaxmEkxxeNCZwdroZ98HPLrcKbo7A9yxRdMoVMRTM\n' +
'3R8y326zIFIvifXo7CIIPS5WQkp4Sw3fWsF/vwi1PUFPv4oOBeSv0SuOrwMu/ebx\n' +
'+QIDAQAB\n' +
'-----END PUBLIC KEY-----';

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

  const payload = jwt.verify(token, PUBLIC_KEY, { algorithms: ["RS256"] });
  if (payload) {
    // @ts-ignore
    req["auth"] = payload;
    next();
  } else {
    res.cookie("token", "");
    res.status(401).end();
  }
}
