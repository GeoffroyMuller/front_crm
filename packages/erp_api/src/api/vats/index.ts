const express = require('express')
import authMiddleware from "core_api/middlewares/auth.middleware";
import VatController from "./vat.controller";

const router = express.Router()

router.use(authMiddleware);

router.get('/', VatController.getAll)
router.post('/', VatController.create)
router.put('/:id', VatController.update)
router.delete('/:id', VatController.delete)


export default router;