import { Model } from "objection";
import SaleLine from "../sales/sale_line.model";
import Vat from "../vats/vat.model";
import QuoteSubline from "./quote_subline.model";

export default class QuoteLine extends SaleLine<QuoteSubline> {
  idQuote?: number;

  // computed
  price?: number;
  taxes?: number;

  static get tableName() {
    return "quote_lines";
  }

  static get relationMappings() {
    const QuoteSublineModel = require("./quote_subline.model").default;
    return {
      sublines: {
        relation: Model.HasManyRelation,
        modelClass: QuoteSublineModel,
        join: {
          from: QuoteLine.tableName + ".id",
          to: "quote_sublines.idLine",
        },
      },
      vat: {
        relation: Model.BelongsToOneRelation,
        modelClass: Vat,
        join: {
          from: QuoteLine.tableName + ".idVat",
          to: "vat.id",
        },
      },
    };
  }

  computePrice() {
    this.price = (this.unit_price || 0) * (this.qty || 0);
    if (this.discount && this.discount_type) {
      if (this.discount_type === "percent") {
        this.price = this.price - this.price * (this.discount / 100);
      } else {
        this.price = this.price - this.discount;
      }
    }
  }

  computeTaxes() {
    this.taxes = (this.price || 0) * ((this.vat?.rate || 1) / 100);
  }
}
