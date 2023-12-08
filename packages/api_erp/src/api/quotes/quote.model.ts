import { Model, Pojo } from "objection";
import Client from "../clients/client.model";
import Invoice from "../invoices/invoice.model";
import QuoteLine from "./quote_line.model";
import { orderBy } from "lodash";
import { QuoteValidationStatus } from "./status";

export default class Quote extends Model {
  id?: number;
  idClient?: number;
  idResponsible?: number;
  idCompany?: number;
  identifier?: string;
  name?: string;
  lines?: Array<QuoteLine>;
  client?: Client;

  footer?: string;
  modalities?: string;
  madeAt?: string;
  madeOn?: string;

  archived?: boolean;

  invoices?: Array<Invoice>;

  validationStatus?: QuoteValidationStatus;

  // computed
  price?: number;
  taxes?: number;

  $formatJson(json: Pojo): Pojo {
    json = super.$formatJson(json);
    json.identifier = "#" + json.identifier;
    if (json.lines?.length) {
      json.lines = orderBy(json.lines, "order");
    }
    return json;
  }

  static get tableName() {
    return "quotes";
  }

  static getValidationStatusString(intValidationStatus: number) {
    return Object.keys(QuoteValidationStatus)[
      Object.values(QuoteValidationStatus).indexOf(intValidationStatus || 0)
    ];
  }

  static relationMappings = {
    invoices: {
      relation: Model.HasManyRelation,
      modelClass: Invoice,
      join: {
        from: "quotes.id",
        to: "invoices.idQuote",
      },
    },
    client: {
      relation: Model.BelongsToOneRelation,
      modelClass: Client,
      join: {
        from: "quotes.idClient",
        to: "clients.id",
      },
    },
    lines: {
      relation: Model.HasManyRelation,
      modelClass: QuoteLine,
      join: {
        from: "quotes.id",
        to: QuoteLine.tableName + ".idQuote",
      },
    },
  };

  computePrice() {
    this.price = (this.lines || []).reduce((prev, curr) => {
      curr.computePrice();
      return prev + (curr.price || 0);
    }, 0);
  }

  computeTaxes() {
    this.taxes = (this.lines || []).reduce((prev, curr) => {
      curr.computeTaxes();
      return prev + (curr.taxes || 0);
    }, 0);
  }
}
