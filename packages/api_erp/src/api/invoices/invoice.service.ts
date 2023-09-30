import { Stream } from "stream";
import serviceFactory from "core_api/service";
import { Service } from "core_api/types";
import type { User } from "core_api/types";;
import Invoice from "./invoice.model";
import { filter, merge } from "lodash";
import mailService from "core_api/services/mail.service";
import { QueryBuilder, raw } from "objection";
import InvoicePayment from "./invoicepayment.model";
import InvoiceLine from "./invoice_line.model";
import { isPopulateNeeded } from "core_api/services/filters.service";
const fs = require("fs");
let ejs = require("ejs");

export interface IInvoiceService extends Service<Invoice, User> {
  sendByMail: (q: Invoice) => Promise<any>;
  getPayments: (i: Invoice) => Promise<InvoicePayment[]>;
  addPayment: (i: Invoice, data: any) => Promise<InvoicePayment>;
}

async function getNextIdentifier(auth: User) {
  const last = await Invoice.query()
    .where("idCompany", auth.idCompany as number)
    .orderBy("id", "DESC")
    .first();
  const lastIdentifier: number = last?.identifier ? +last?.identifier : 0;

  return lastIdentifier + 1;
}

function withPrice(query: QueryBuilder<Invoice>) {
  return query.select(
    raw(`(
      SELECT SUM(${InvoiceLine.tableName}.unit_price * ${InvoiceLine.tableName}.qty) 
      FROM ${InvoiceLine.tableName} 
      WHERE ${InvoiceLine.tableName}.idInvoice = invoices.id
    )`).as("price")
  );
}
function withTaxes(query: QueryBuilder<Invoice>) {
  return query.select(
    raw(`(
      SELECT SUM(${InvoiceLine.tableName}.unit_price * ${InvoiceLine.tableName}.qty) * (vat.rate / 100) 
      FROM ${InvoiceLine.tableName} 
      JOIN vat ON vat.id = ${InvoiceLine.tableName}.idVat
      WHERE ${InvoiceLine.tableName}.idInvoice = invoices.id
    )`).as("taxes")
  );
}

const invoiceService = serviceFactory(Invoice, {
  isAuthorized(model, auth) {
    return Invoice.fromJson(model)?.idCompany == auth?.idCompany;
  },
  async onBeforeFetchList({ query, auth, filters, data }) {
    if (auth != null) {
      if (auth.idCompany) {
        query.where("invoices.idCompany", auth.idCompany);
      }
    }
    query.select("invoices.*");
    query = withPrice(query);
    query = withTaxes(query);
    
    
    return { query, auth, filters, data };
  },
  async onBeforeGetById({ query, auth, filters, data }) {
    query.select("invoices.*");

    if (isPopulateNeeded(filters, "total")) {
      query = withPrice(query);
      query = withTaxes(query);
    }

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
        identifier: await getNextIdentifier(auth)
      },
    };
  },
  async onBeforeUpdate({ query, auth, filters, data }) {
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
      },
    };
  },
}) as IInvoiceService;

invoiceService.create = async (body: any, auth) => {
  const { data, query } = await invoiceService.onBeforeCreate({
    query: Invoice.query(),
    data: body,
    auth,
  });
  await invoiceService.checkAuthorization(data, auth);
  return (await query.upsertGraphAndFetch(
    {
      ...data,
    },
    { relate: true }
  )) as unknown as Invoice;
};

invoiceService.update = async (body: any, auth) => {
  const { data, query } = await invoiceService.onBeforeUpdate({
    query: Invoice.query(),
    data: body,
    auth,
  });
  await invoiceService.getById(data.id, auth);
  const invoice = (await query.upsertGraphAndFetch(
    {
      id: data.id,
      ...data,
    },
    { relate: true }
  )) as unknown as Invoice;
  return invoice;
};

function _mapDataToDisplay(invoice: Invoice) {
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
      ...invoice,
      lines:
        invoice?.lines?.map((line) => ({
          ...line,
          vatRate: line?.vat?.rate ? `${line?.vat?.rate}%` : "-",
        })) || [],
    }
  );
}

invoiceService.sendByMail = async (invoice: Invoice) => {
  try {
    const res = await mailService.sendMail({
      html: ejs.render(
        fs.readFileSync(__dirname + "/../../templates/invoice.ejs", "utf8"),
        _mapDataToDisplay(invoice)
      ),
      text: "",
      subject: "Facture",
      to: invoice?.client?.email as string,
    });
    return res;
  } catch (err) {
    console.error(err);
    return err;
  }
};

invoiceService.getPayments = async (i: Invoice) => {
  return i.$relatedQuery('payments').execute();
};


invoiceService.addPayment = async (i: Invoice, data: any) => {
  return InvoicePayment.query().insertAndFetch({
    ...data,
    idInvoice: i.id
  });
};

export default invoiceService;
