import type { Dayjs } from "dayjs";
import type Client from "./client";
import type { Product, ProductReal } from "./product";
import type { ID } from "./utils";

export interface Sale {
  id?: ID;
  idCompany?: ID;
  idCustomer?: ID;
  idSeller?: ID;
  date?: string | Dayjs;
  created_at?: string | Dayjs;

  products?: Array<Product>;
  products_real?: Array<ProductReal>;
  customer?: Client;
}
