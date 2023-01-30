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

  product_lines?: Array<SaleProductLine>;
  product_real_lines?: Array<SaleProductRealLine>;
  customer?: Client;
}

export interface SaleProductLine extends Product {
  saleProductPrice?: number;
  quantity?: number;
}

export interface SaleProductRealLine extends ProductReal {
  saleProductRealPrice?: number;
}

/* interface for form data */
export interface SaleForm {
  idCustomer?: ID;
  form_product_lines?: Array<SaleFormProductLine>;
}
export interface SaleFormProductLine {
  product?: Product;
  form_product_real_lines?: Array<SaleFormProductRealLine>;
  price?: number;
  quantity?: number;
}
export interface SaleFormProductRealLine {
  product_real?: ProductReal;
  price?: number;
}
