import type dayjs from "dayjs";
import type Customer from "./customer";

export default interface Reservation {
  customer?: Customer;
  date: dayjs.Dayjs;
}
