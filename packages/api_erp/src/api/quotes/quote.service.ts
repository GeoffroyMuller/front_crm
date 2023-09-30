import Quote from "./quote.model";
import type { User } from "core_api/types";
import mailService from "core_api/services/mail.service";
import serviceFactory from "core_api/service";
import { Service } from "core_api/types";
import { raw } from "objection";
import QuoteLine from "./quote_line.model";
import { NotFoundError } from "core_api/errors";

export interface IQuoteService extends Service<Quote, User> {
  sendByMail: (q: Quote, token: string) => Promise<any>;
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
    },
    { relate: true }
  )) as unknown as Quote;
};

quoteService.update = async (body: any, auth, filters) => {
  const data = await quoteService.getById(body.id, auth, [], filters);
  if (!data) throw new NotFoundError();
  const quote = (await Quote.query().upsertGraphAndFetch(
    {
      id: body.id,
      ...body,
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

export default quoteService;
