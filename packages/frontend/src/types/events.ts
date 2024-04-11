import type { Company } from "./company";
import type { ID } from "core/src/types";
import type { CalendarEvent } from "core/src/components/Calendar.vue";

export interface Event extends CalendarEvent {
  idCompany?: number;
  company?: Company;

  idProduct?: ID;
}
