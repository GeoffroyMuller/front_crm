import { Product } from './product';
import type { ID } from "core/src/types";
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
  product?: Product;
  sublines?: Array<SaleSubline>;
}
