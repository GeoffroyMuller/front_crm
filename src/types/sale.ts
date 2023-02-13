import type { ID } from "./utils";
import type { Vat } from "./vat";

export interface SaleSubline {
  id?: ID;
  idProductReal?: number;
}
export interface SaleLine {
  description: string;
  discount?: number;
  discount_type: null;
  id: ID;
  idQuote?: number;
  idVat?: number;
  qty?: number;
  type: "title" | "product" | "comment" | "discount";
  unit_price?: number;
  vat: Vat;
  idProduct?: number;
  sublines?: Array<SaleSubline>;
}
