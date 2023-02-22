import type { Dayjs } from "dayjs";
import type Client from "./client";
import type { SaleLine } from "./sale";
import type { ID } from "core/src/types";
import type { Vat } from "./vat";

export interface Reservation {
  id?: ID;
  idCompany?: ID;
  idClient?: ID;
  description?: string;
  dtstart?: string | Dayjs;
  dtend?: string | Dayjs;
  created_at?: string | Dayjs;

  lines?: Array<SaleLine>;

  client?: Client;
}
