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

  product_lines?: Array<SaleProductLineType>;
  product_real_lines?: Array<SaleProductRealLineType>;
  customer?: Client;
}

export interface SaleProductLineReceivedByAPI extends Product {
  saleProductPrice?: number;
  quantity?: number;
}

export interface SaleProductRealLineReceivedByAPI extends ProductReal {
  saleProductRealPrice?: number;
}

export interface SaleProductLineType {
  idProduct?: ID;
  saleProductPrice?: number;
  quantity?: number;
}

export interface SaleProductRealLineType {
  idProductReal?: ID;
  saleProductRealPrice?: number;
}

/* interface for form data */
export interface SaleForm {
  idCustomer?: ID;
  date?: string | Dayjs;
  form_product_lines?: Array<SaleFormProductLine>;
}
export interface SaleFormProductLine {
  idProduct?: ID | null;
  form_product_real_lines?: Array<SaleFormProductRealLine>;
  price?: number;
  quantity?: number;
}
export interface SaleFormProductRealLine {
  idProductReal?: ID | null;
  price?: number;
}
