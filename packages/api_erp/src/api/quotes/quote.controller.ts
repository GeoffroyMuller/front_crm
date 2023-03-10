import { Stream } from "stream";
import controllerFactory, { getToken } from "core_api/controller";
import type { User } from "core_api/types";
import Quote from "./quote.model";
import QuoteService from "./quote.service";

const quoteController = controllerFactory<Quote, User>(QuoteService);

quoteController.preview = async (req, res) => {
  try {
    const quote = await QuoteService.getById(req.params.id, req.auth, [
      "client.company",
      "responsible.company",
      "lines.vat",
    ]);
    return res.send(await QuoteService.preview(quote, getToken(req) as string));
  } catch (err) {
    return quoteController.handleError(req, res, err);
  }
};

quoteController.getPdf = async (req, res) => {
  try {
    const quote = await QuoteService.getById(req.params.id, req.auth, [
      "client.company",
      "responsible.company",
      "lines.vat",
    ]);

    res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-disposition": `attachment; filename=quote_${quote?.identifier}.pdf`,
    });

    const pdf: Stream = (await QuoteService.getPdf(quote, getToken(req) as string)) as Stream;
    pdf.pipe(res);
    return res;
  } catch (err) {
    return quoteController.handleError(req, res, err);
  }
};

quoteController.sendByMail = async (req, res) => {
  try {
    const quote = await QuoteService.getById(req.params.id, req.auth, [
      "client.company",
      "responsible.company",
      "lines.vat",
    ]);
    return res.json(await QuoteService.sendByMail(quote, getToken(req) as string));
  } catch (err) {
    return quoteController.handleError(req, res, err);
  }
};

export default quoteController;
