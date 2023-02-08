import type { Dayjs } from "dayjs";
import type { Company } from "./company";
import type { ID } from "./utils";

export interface Event {
  id?: number;
  dtstamp?: string | Dayjs;
  dtstart?: string | Dayjs;
  dtend?: string | Dayjs;
  summary?: string;
  description?: string;
  location?: string;
  recurrence_freq?: "DAILY" | "WEEKLY" | "MONTHLY" | "YEARLY";
  recurrence_interval?: number;
  recurrence_count?: number;
  recurrence_until?: string;

  idCompany?: number;
  company?: Company;

  idProduct?: ID;
}
