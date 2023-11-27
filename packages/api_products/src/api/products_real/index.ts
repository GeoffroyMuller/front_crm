const express = require('express')
import authMiddleware from "core_api/middlewares/auth.middleware";
import ProductRealController from "./product_real.controller";

const router = express.Router()

router.get('/', authMiddleware, ProductRealController.paginate)
router.post('/', authMiddleware, ProductRealController.create)
router.put('/:id', authMiddleware, ProductRealController.update)
router.delete('/:id',authMiddleware, ProductRealController.remove)
router.get('/:id', authMiddleware, ProductRealController.findByID)

export default router;