const express = require("express");
import authMiddleware from "core_api/middlewares/auth.middleware";
import { accessMiddlewareFactory } from "core_api/middlewares/access.middleware";
import SectionController from "./sections.controller";

const router = express.Router();

router.use(authMiddleware);

router.post("/", SectionController.create);
router.put("/:id", SectionController.update);
router.delete("/:id", SectionController.remove);

export default router;
