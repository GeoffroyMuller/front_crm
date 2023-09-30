import { NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

const companyMiddleware = {
  query(req: AuthRequest, res: Response, next: NextFunction) {
    req.query = {
      ...req.query,
      $eq: {
        idCompany: req.auth.idCompany as string,
      },
    };
    next();
  },
  mutate(req: AuthRequest, res: Response, next: NextFunction) {
    req.body = {
      ...req.body,
      idCompany: req.auth.idCompany,
    };
    next();
  },
};

export default companyMiddleware;
