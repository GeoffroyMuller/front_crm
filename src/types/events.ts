import type { Company } from "./company";

export type Event = {
  id?: number;
  dtstamp?: string;
  dtstart?: string;
  dtend?: string;
  summary?: string;
  description?: string;
  location?: string;
  rrule?: string;
  organizer?: string;
  attendee?: string;
  status?: string;

  idCompany?: number;
  company?: Company;
};
