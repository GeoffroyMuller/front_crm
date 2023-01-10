import type { ID } from "./utils";

export interface Product {
  id: ID;
  idCompany?: ID;
  name?: string;
  description?: string;
  price?: number;
  isNumeraryStock?: boolean;
  stock?: number;

  products_real?: Array<ProductReal>;
  product_fields?: Array<ProductField>;
}

export interface ProductReal {
  id?: ID;
  idProduct?: ID;
  product?: Product;
  reference?: string;
}

export interface ProductField {
  id?: ID;
  idProduct?: ID;
  name?: string;
  type?: string;
  product?: Product;
}
