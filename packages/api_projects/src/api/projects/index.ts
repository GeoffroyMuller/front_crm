const express = require("express");
import authMiddleware from "core_api/middlewares/auth.middleware";
import { accessMiddlewareFactory } from "core_api/middlewares/access.middleware";
import ProjectController from "./project.controller";
import SectionController from "./sections.controller";

const router = express.Router();

router.use(authMiddleware);

router.get("/:id", ProjectController.findByID);
router.get("/", ProjectController.paginate);
router.post("/", ProjectController.create);
router.put("/:id", ProjectController.update);
router.delete("/:id", ProjectController.remove);

router.post("/:idProject/sections", SectionController.create);
router.put("/:idProject/sections/:id", SectionController.update);
router.delete("/:idProject/sections/:id", SectionController.remove);

export default router;
