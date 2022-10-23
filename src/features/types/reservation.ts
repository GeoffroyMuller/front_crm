import type dayjs from "dayjs";
import type Customer from "./customer";

export default interface Reservation {
  id: string | number;
  customer: Customer;
  date: string;
}
