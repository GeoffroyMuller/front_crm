import { NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

const companyMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  req.query = {
    ...req.query,
    $eq: {
      idCompany: req.auth.idCompany as string,
    },
  };
  req.body = {
    ...req.body,
    idCompany: req.auth.idCompany,
  };
  next();
};

export default companyMiddleware;
