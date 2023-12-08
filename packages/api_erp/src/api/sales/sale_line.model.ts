import { Model } from "objection";
import Vat from "../vats/vat.model";

export default class SaleLine<T> extends Model {
  id?: number;
  idProduct?: number;
  description?: string;
  qty?: number;
  unit_price?: number;
  discount?: number;
  discount_type?: "amount" | "percent";
  type?: "title" | "product" | "comment" | "discount";
  idVat?: number;
  order?: number;

  vat?: Vat;

  sublines?: Array<T>;
}
