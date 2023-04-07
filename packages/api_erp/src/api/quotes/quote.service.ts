import { Stream } from "stream";
import Quote from "./quote.model";
import type { User } from "core_api/types";
import PdfService from "core_api/services/pdf.service";
import mailService from "core_api/services/mail.service";
import serviceFactory from "core_api/service";
import { merge } from "lodash";
import { Service } from "core_api/types";
import { raw } from "objection";
import QuoteLine from "./quote_line.model";
import axios from "axios";
const fs = require("fs");
let ejs = require("ejs");

export interface IQuoteService extends Service<Quote, User> {
  preview: (q: Quote, token: string) => Promise<string>;
  sendByMail: (q: Quote, token: string) => Promise<any>;
  getPdf: (q: Quote, token: string) => Promise<Stream>;
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
  isAuthorized: async (model: Quote | Object, user: User) => {
    return Quote.fromJson(model)?.idCompany == user?.idCompany;
  },
  async onBeforeFetchList({ query, auth, filters, data }) {
    if (auth != null) {
      if (auth.idCompany) {
        query.where("quotes.idCompany", auth.idCompany);
      }
    }
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
  async onBeforeUpdate({ query, auth, filters, data }) {
    if (data.lines?.length) {
      data.lines = data.lines.map((val: any, order: number) => ({
        ...val,
        order,
      }));
    }
    data.idCompany = auth.idCompany;
    return { query, auth, filters, data };
  },
  async onBeforeCreate({ query, auth, filters, data }) {
    if (data.lines?.length) {
      data.lines = data.lines.map((val: any, order: number) => ({
        ...val,
        order,
      }));
    }
    return {
      query,
      auth,
      filters,
      data: {
        ...data,
        idCompany: auth.idCompany,
        idResponsible: auth.id,
        identifier: await getNextIdentifier(auth),
        status: "draft",
      },
    };
  },
}) as IQuoteService;

quoteService.create = async (body: any, auth) => {
  const { data, query } = await quoteService.onBeforeCreate({
    query: Quote.query(),
    data: body,
    auth,
  });
  await quoteService.checkAuthorization(data, auth);
  return (await query.upsertGraphAndFetch(
    {
      ...data,
    },
    { relate: true }
  )) as unknown as Quote;
};

quoteService.update = async (body: any, auth) => {
  const { data, query } = await quoteService.onBeforeUpdate({
    query: Quote.query(),
    data: body,
    auth,
  });
  await quoteService.getById(data.id, auth);
  const quote = (await query.upsertGraphAndFetch(
    {
      id: data.id,
      ...data,
    },
    { relate: true }
  )) as unknown as Quote;
  return quote;
};

function _mapQuoteDataToDisplay(quote: Quote) {
  return merge(
    {
      client: {
        firstname: "",
        lastname: "",
        company: { name: "" },
      },
      responsible: {
        firstname: "",
        lastname: "",
        company: { name: "" },
      },
      modalities: "",
      footer: "",
    },
    {
      ...quote,
      lines:
        quote?.lines?.map((line) => ({
          ...line,
          vatRate: line?.vat?.rate ? `${line?.vat?.rate}%` : "-",
        })) || [],
    }
  );
}

quoteService.preview = async (quote: Quote, token: string) => {
  const html = fs.readFileSync(
    __dirname + "/../../templates/quote.ejs",
    "utf8"
  );
  let responsible = {};
  try {
    responsible = (
      await axios.get(
        process.env.AUTH_SERVICE_URL + "/users/" + quote.idResponsible,
        {
          headers: {
            Authorization: token,
          },
        }
      )
    ).data;
  } catch (err) {
    console.log(err);
  }
  const htmlReplaced: string = ejs.render(html, {
    ..._mapQuoteDataToDisplay(quote),
    responsible,
  });
  return htmlReplaced;
};

quoteService.getPdf = async (quote: Quote, token: string) => {
  let quoteToPrint = quote;
  let responsible = {};
  try {
    responsible = (
      await axios.get(
        process.env.AUTH_SERVICE_URL + "/users/" + quote.idResponsible,
        {
          headers: {
            Authorization: token,
          },
        }
      )
    ).data;
  } catch (err) {
    console.log(err);
  }
  const pdf = await PdfService.printPDF({
    data: {
      ..._mapQuoteDataToDisplay(quote),
      responsible,
    },
    inputPath: __dirname + "/../../templates/quote.ejs",
    returnType: "stream",
  });
  return pdf as Stream;
};

quoteService.sendByMail = async (quote: Quote, token: string) => {
  try {
    let responsible = {};
    try {
      responsible = (
        await axios.get(
          process.env.AUTH_SERVICE_URL + "/users/" + quote.idResponsible,
          {
            headers: {
              Authorization: token,
            },
          }
        )
      ).data;
    } catch (err) {
      console.log(err);
    }
    const res = await mailService.sendMail({
      html: ejs.render(
        fs.readFileSync(__dirname + "/../../templates/quote.ejs", "utf8"),
        {
          ..._mapQuoteDataToDisplay(quote),
          responsible,
        }
      ),
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
