const express = require("express");
import authMiddleware from "core_api/middlewares/auth.middleware";
import { accessMiddlewareFactory } from "core_api/middlewares/access.middleware";
import ProjectController from "./project.controller";

const router = express.Router();

router.use(authMiddleware);

router.get("/", ProjectController.paginate);
router.post("/", ProjectController.create);
router.put("/:id", ProjectController.update);
router.delete("/:id", ProjectController.remove);

export default router;
