import { NextFunction } from "express";
import { AuthRequest } from "./auth.middleware";

/// @deprecated
const companyMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  req.query = {
    ...req.query,
    $eq: {
      idCompany: req.auth.idCompany as string,
      // @ts-ignore
      ...(typeof req?.query?.$eq) === 'object' ? req?.query?.$eq : {},
    },
  };
  req.body = {
    ...req.body,
    idCompany: req.auth.idCompany,
  };
  next();
};

export default companyMiddleware;
