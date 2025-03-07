const express = require("express");
import authMiddleware from "core_api/middlewares/auth.middleware";
import controller from "./reservation.controller";

const router = express.Router();

router.get("/", authMiddleware, controller.paginate);
router.post("/", authMiddleware, controller.create);
router.put("/:id", authMiddleware, controller.update);
router.delete("/:id", authMiddleware, controller.delete);
router.get("/:id", authMiddleware, controller.getById);

export default router;
