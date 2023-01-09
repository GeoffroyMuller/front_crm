import type { ID } from "./utils";

export interface Product {
  id: ID;
  idCompany?: ID;
  name?: string;
  description?: string;
  price?: number;
}
