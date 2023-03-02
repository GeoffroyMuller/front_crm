const express = require('express')
import AuthController from "./auth.controller";
import authMiddleware from "core_api/middlewares/auth.middleware";

const router = express.Router()

router.post('/login', AuthController.login)
router.post('/register', AuthController.register)
router.post('/verify', authMiddleware, AuthController.verify)

export default router;