import type { Company } from "./company";

export default interface Client {
  id: number;
  firstname: string;
  lastname: string;
  email: string;
  phone: string;
  address: string;
  idCompany: number;
  company: Company;
}
