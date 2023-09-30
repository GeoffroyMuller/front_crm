import { Stream } from "stream";
import controllerFactory from "core_api/controller";
import invoiceService from "./invoice.service";


const invoiceController = controllerFactory(invoiceService);

invoiceController.sendByMail = async (req, res) => {
    try {
        const invoice = await invoiceService.getById(req.params.id, req.auth, [
            "client.company", "responsible.company", "lines.vat"
        ]);
        return res.json(await invoiceService.sendByMail(invoice))
    } catch (err) {
        return invoiceController.handleError(req, res, err);
    }
}

invoiceController.getPayments = async (req, res) => {
    try {
        const invoice = await invoiceService.getById(req.params.id, req.auth);
        return res.json(await invoiceService.getPayments(invoice));
    } catch (err) {
        return invoiceController.handleError(req, res, err);
    }
}

invoiceController.addPayment = async (req, res) => {
    try {
        const invoice = await invoiceService.getById(req.params.id, req.auth);
        return res.json(await invoiceService.addPayment(invoice, req.body));
    } catch (err) {
        return invoiceController.handleError(req, res, err);
    }
}


export default invoiceController;