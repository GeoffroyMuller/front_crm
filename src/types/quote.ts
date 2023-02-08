import type Client from "./client";
import type Invoice from "./invoice";
import type { User } from "./user";
import type { ID } from "./utils";
import type { Vat } from "./vat";

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
  lines: Array<QuoteLine>;
  madeAt: string;
  madeOn: string;
  modalities: string;
  name: string;
  responsible: User;
  status: "draft" | "refused" | "validated";
  price?: number;
  taxes?: number;
}

export interface QuoteSubLine {
  id: ID;
  idProductReal: ID;
}

export interface QuoteLine {
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
  sublines?: Array<QuoteSubLine>;
}
