const express = require("express");
import QuoteController from "./quote.controller";
import authMiddleware from "core_api/middlewares/auth.middleware";
import { accessMiddlewareFactory } from "core_api/middlewares/access.middleware";
import companyMiddleware from "core_api/middlewares/company.middleware";
const router = express.Router();

router.use(authMiddleware);

router.get("/", companyMiddleware, QuoteController.paginate);
router.get("/:id", companyMiddleware, QuoteController.getById);
router.post("/:id/send_mail", companyMiddleware, QuoteController.sendByMail);

router.post(
  "/",
  accessMiddlewareFactory("manage_quotes"),
  companyMiddleware,
  QuoteController.create
);
router.put(
  "/:id",
  accessMiddlewareFactory("manage_quotes"),
  companyMiddleware,
  QuoteController.update
);
router.delete(
  "/:id",
  accessMiddlewareFactory("manage_quotes"),
  companyMiddleware,
  QuoteController.delete
);

export default router;
