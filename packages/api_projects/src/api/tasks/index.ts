const express = require("express");
import authMiddleware from "core_api/middlewares/auth.middleware";
import { accessMiddlewareFactory } from "core_api/middlewares/access.middleware";
import TasksController from "./tasks.controller";
const router = express.Router();

router.use(authMiddleware);

router.post('/', TasksController.create);

export default router;
