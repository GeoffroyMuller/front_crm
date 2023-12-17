const express = require("express");
import authMiddleware from "core_api/middlewares/auth.middleware";
import { accessMiddlewareFactory } from "core_api/middlewares/access.middleware";
import ProductController from "./product.controller";

const router = express.Router();

router.use(authMiddleware);

router.get("/", ProductController.paginate);
router.post(
  "/",
  accessMiddlewareFactory("manage_products"),
  ProductController.create
);
router.put(
  "/:id",
  accessMiddlewareFactory("manage_products"),
  ProductController.update
);
router.delete(
  "/:id",
  accessMiddlewareFactory("manage_products"),
  ProductController.remove
);
router.get("/:id", ProductController.findByID);

router.post("/:id/image", ProductController.addImage);

export default router;
