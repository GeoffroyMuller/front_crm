const express = require('express')
import authMiddleware from "core_api/middlewares/auth.middleware";
import { accessMiddlewareFactory } from "core_api/middlewares/access.middleware";
import ClientController from "./client.controller";

const router = express.Router()

router.use(authMiddleware);

router.get('/', ClientController.getAll)
router.post('/', accessMiddlewareFactory('manage_clients'), ClientController.create)
router.put('/:id', accessMiddlewareFactory('manage_clients'), ClientController.update)
router.delete('/:id', accessMiddlewareFactory('manage_clients'),  ClientController.delete)
router.get('/:id', ClientController.getById)

export default router;