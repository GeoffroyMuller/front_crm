import Quote from "./quote.model";
import type { ID, User } from "core_api/types";
import mailService from "core_api/services/mail.service";
import serviceFactory from "core_api/service";
import { Service } from "core_api/types";
import { raw } from "objection";
import QuoteLine from "./quote_line.model";
import { NotFoundError } from "core_api/errors";
import PdfService from 'core_api/services/pdf.service';
import { Stream } from "stream";

export interface IQuoteService extends Service<Quote, User> {
  sendByMail: (q: Quote, token: string) => Promise<any>;
  getPdf: (body: any, auth: User) => Promise<Stream>;
}

async function getNextIdentifier(auth: User) {
  const last = await Quote.query()
    .where("idCompany", auth.idCompany as number)
    .orderBy("id", "DESC")
    .first();
  const lastIdentifier: number = last?.identifier ? +last?.identifier : 0;

  return lastIdentifier + 1;
}

const quoteService = serviceFactory<Quote, User>(Quote, {
  async onBeforeFetchList({ query, auth, filters, data }) {
    query.select("quotes.*");
    query.select(
      raw(`(
        SELECT SUM(${QuoteLine.tableName}.unit_price * ${QuoteLine.tableName}.qty) 
        FROM ${QuoteLine.tableName} 
        WHERE ${QuoteLine.tableName}.idQuote = quotes.id
      )`).as("price")
    );
    query.select(
      raw(`(
        SELECT SUM(${QuoteLine.tableName}.unit_price * ${QuoteLine.tableName}.qty) * (vat.rate / 100) 
        FROM ${QuoteLine.tableName} 
        JOIN vat ON vat.id = ${QuoteLine.tableName}.idVat
        WHERE ${QuoteLine.tableName}.idQuote = quotes.id
      )`).as("taxes")
    );
    return { query, auth, filters, data };
  },
}) as IQuoteService;

quoteService.create = async (body: any, auth, filters) => {
  return (await Quote.query().upsertGraphAndFetch(
    {
      ...body,
      idResponsible: auth.id,
      identifier: await getNextIdentifier(auth),
      idCompany: auth.idCompany,
    },
    { relate: true }
  )) as unknown as Quote;
};

quoteService.update = async (body: any, auth, filters) => {
  const data = await quoteService.getById(body.id, auth, [], filters);
  if (!data) throw new NotFoundError();
  delete body.identifier;
  const quote = (await Quote.query().upsertGraphAndFetch(
    {
      id: body.id,
      ...body,
      idCompany: auth.idCompany,
      lines: body.lines?.length
        ? body.lines.map((val: any, order: number) => ({
            ...val,
            order,
          }))
        : undefined,
    },
    { relate: true }
  )) as unknown as Quote;
  return quote;
};

quoteService.sendByMail = async (quote: Quote, token: string) => {
  try {
    const res = await mailService.sendMail({
      html: "",
      text: "",
      subject: "Devis",
      to: quote?.client?.email as string,
    });
    return res;
  } catch (err) {
    console.error(err);
    return err;
  }
};

quoteService.getPdf = async (id: ID, auth: User) => {
  const quote = await quoteService.getById(id, auth, ['client.company', 'lines']);
  if (quote == null) {
    throw new NotFoundError();
  }
  const pdf = await PdfService.printPDF({
    data: {
      responsible: {
        firstname: 'Jean-Michel',
        lastname: 'DataEnDur',
        company: {
          name: 'Company en dur'
        }
      },
      client: undefined,
      footer: undefined,
      modalities: undefined,
      lines: undefined,
      ...quote,
    } as Partial<Quote>,
    inputPath: __dirname + "/../../templates/quote.ejs",
    returnType: "stream",
  });
  return pdf as Stream;
};

export default quoteService;
