const express = require('express')
import QuoteController from "./quote.controller";
import authMiddleware from "core_api/middlewares/auth.middleware";
import { accessMiddlewareFactory } from "core_api/middlewares/access.middleware";
import companyMiddleware  from 'core_api/middlewares/company.middleware'
const router = express.Router()

router.use(authMiddleware)

router.get('/', companyMiddleware.query, QuoteController.paginate)
router.post('/', accessMiddlewareFactory('manage_quotes'), companyMiddleware.mutate, QuoteController.create)
router.put('/:id', accessMiddlewareFactory('manage_quotes'), companyMiddleware.mutate, QuoteController.update)
router.delete('/:id', accessMiddlewareFactory('manage_quotes'), QuoteController.delete)
router.get('/:id', QuoteController.getById)
router.post('/:id/send_mail', QuoteController.sendByMail)

export default router;