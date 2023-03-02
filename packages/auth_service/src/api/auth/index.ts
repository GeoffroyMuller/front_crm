const express = require('express')
import AuthController from "./auth.controller";

const router = express.Router()

router.post('/login', AuthController.login)
router.post('/register', AuthController.register)
router.post('/verify', AuthController.verify)

export default router;