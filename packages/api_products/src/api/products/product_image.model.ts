import { Model } from "objection";

export default class ProductImage extends Model {
  id?: number;
  idProduct?: number;
  idMedia?: number;
  filepath?: string;


  static get tableName() {
    return "products_images";
  }

  static get relationMappings() {
    return {
     
    };
  }
}
