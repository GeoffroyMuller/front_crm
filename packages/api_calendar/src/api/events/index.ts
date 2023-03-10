const express = require('express')
import authMiddleware from "core_api/middlewares/auth.middleware";
import eventController from "./event.controller";

const router = express.Router()

router.use(authMiddleware);

router.get('/', eventController.getAll)
router.post('/', eventController.create)
router.put('/:id', eventController.update)
router.delete('/:id', eventController.delete)
router.get('/:id', eventController.getById) 


export default router;