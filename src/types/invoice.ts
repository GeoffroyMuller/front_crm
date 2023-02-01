import type Client from "./client";
import type { User } from "./user";
import type { ID } from "./utils";
import type { Vat } from "./vat";

export default interface Invoice {
  id: ID;
  archived: boolean;
  client?: Client;
  footer: string;
  idClient: ID;
  idCompany: ID;
  idResponsible: ID;
  identifier: string;
  lines: Array<InvoiceLine>;
  madeAt: string;
  madeOn: string;
  modalities: string;
  name: string;
  responsible: User;
  status: "draft";
}

export interface InvoiceLine {
  description: string;
  discount?: number;
  discount_type: null;
  id: ID;
  idInvoice?: ID;
  idVat?: ID;
  qty?: number;
  type: "title" | "product" | "comment" | "discount";
  unit_price?: number;
  vat?: Vat;
}
