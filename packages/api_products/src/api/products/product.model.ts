import { Model } from "objection";
import ProductField from "./product_field.model";
import ProductReal from "../products_real/product_real.model";
import ProductImage from "./product_image.model";

export default class Product extends Model {
  id?: number;
  idCompany?: number;
  idVat?: number;
  name?: string;
  description?: string;
  price?: number;
  stockManagement?: "numerary" | "physical" | null | "events";
  stock?: number;
  stock_physical?: number;

  products_real?: Array<ProductReal>;
  product_fields?: Array<ProductField>;
  images?: ProductImage[];

  static get tableName() {
    return "products";
  }

  static get relationMappings() {
    return {
      products_real: {
        relation: Model.HasManyRelation,
        modelClass: ProductReal,
        join: {
          from: "products.id",
          to: "products_real.idProduct",
        },
      },
      product_fields: {
        relation: Model.HasManyRelation,
        modelClass: ProductField,
        join: {
          from: "products.id",
          to: "product_fields.idProduct",
        },
      },
      images: {
        relation: Model.HasManyRelation,
        modelClass: ProductImage,
        join: {
          from: "products.id",
          to: ProductImage.tableName + ".idProduct",
        },
      },
    };
  }
}
