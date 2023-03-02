const express = require("express");
import authMiddleware from "core_api/middlewares/auth.middleware";
import { accessMiddlewareFactory } from "core_api/middlewares/access.middleware";
import RIGHTS from "./rights";
import controller from "./role.controller";

const router = express.Router();

router.use(authMiddleware);

router.get("/", controller.getAll);
router.post("/", accessMiddlewareFactory("manage_role"), controller.create);
router.put("/:id", accessMiddlewareFactory("manage_role"), controller.update);
router.delete(
  "/:id",
  accessMiddlewareFactory("manage_role"),
  controller.delete
);
router.get("/:id", controller.getById);

export default router;
