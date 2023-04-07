import { Model } from "objection";

export default class SaleLine<T> extends Model {
  id?: number;
  idProduct?: number;
  description?: string;
  qty?: number;
  unit_price?: number;
  discount?: number;
  discount_type?: "€" | "%";
  type?: "title" | "product" | "comment" | "discount";
  idVat?: number;
  order?: number;
  sublines?: Array<T>;
}
