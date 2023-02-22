import type Client from "./client";
import type { SaleLine } from "./sale";
import type { User } from "./user";
import type { ID } from "./utils";

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
  responsible: User;
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
