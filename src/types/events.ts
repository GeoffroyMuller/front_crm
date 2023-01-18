import type { Dayjs } from "dayjs";
import type { Company } from "./company";

export interface Event {
  id?: number;
  dtstamp?: string | Dayjs;
  dtstart?: string | Dayjs;
  dtend?: string | Dayjs;
  summary?: string;
  description?: string;
  location?: string;
  rrule?: string;
  organizer?: string;
  attendee?: string;
  status?: string;

  idCompany?: number;
  company?: Company;
}
