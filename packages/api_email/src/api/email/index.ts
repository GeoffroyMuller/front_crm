import express from "express";
import authMiddleware from "core_api/middlewares/auth.middleware";
import { IAuthRequest, User } from "core_api/types";
import { handleError } from "core_api/errors";
import mailjetService from "./email.service";

const router = express.Router();

router.use(authMiddleware);

router.post("/send", async (req, res) => {
  try {
    res.json(
      await mailjetService.send(req.body, (req as IAuthRequest<User>).auth)
    );
  } catch (err) {
    return handleError(req as IAuthRequest<User>, res, err);
  }
});

router.post("/mailjet/configure", async (req, res) => {
  try {
    res.json(
      await mailjetService.configure(req.body, (req as IAuthRequest<User>).auth)
    );
  } catch (err) {
    return handleError(req as IAuthRequest<User>, res, err);
  }
});

router.get("/mailjet/configure", async (req, res) => {
  try {
    res.json(
      await mailjetService.findConfiguration((req as IAuthRequest<User>).auth)
    );
  } catch (err) {
    return handleError(req as IAuthRequest<User>, res, err);
  }
});

export default router;
