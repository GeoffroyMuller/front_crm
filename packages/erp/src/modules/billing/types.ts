import type Client from "@/types/client";
import type { Product } from "@/types/product";
import type { Vat } from "@/types/vat";
import type { ID } from "core/src/types";

export interface QuoteInvoiceTheme {
  id: ID;
  name: string;
}

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

export interface Quote {
  archived: boolean;
  client: Client;
  footer: string;
  id: ID;
  idClient: ID;
  idCompany: ID;
  idResponsible: ID;
  identifier: string;
  invoices: Array<Invoice>;
  lines: Array<SaleLine>;
  madeAt: string;
  madeOn: string;
  modalities: string;
  name: string;
  status: "draft" | "refused" | "validated";
  price?: number;
  taxes?: number;
}

export default interface Invoice {
  id: ID;
  archived: boolean;
  client?: Client;
  footer: string;
  idClient: ID;
  idCompany: ID;
  idResponsible: ID;
  identifier: string;
  lines: Array<SaleLine>;
  payments?: Array<InvoicePayment>;
  madeAt: string;
  madeOn: string;
  modalities: string;
  name: string;
  status: "draft";
  price?: number;
  taxes?: number;
}

export interface InvoicePayment {
  id?: ID;
  idClient: ID;
  idInvoice: ID;
  amount: number;
  created_at: string;
}
