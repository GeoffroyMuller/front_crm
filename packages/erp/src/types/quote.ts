import type Client from "./client";
import type Invoice from "./invoice";
import type { SaleLine } from "./sale";
import type { User } from "./user";
import type { ID } from "core/src/types";

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
  responsible: User;
  status: "draft" | "refused" | "validated";
  price?: number;
  taxes?: number;
}
