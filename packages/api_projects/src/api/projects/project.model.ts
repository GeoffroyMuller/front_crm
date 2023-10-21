import { Model } from "objection";

export default class Project extends Model {
  id?: number;
  idCompany?: number;
  name?: string;
  description?: string;

  static get tableName() {
    return "products";
  }

  static get relationMappings() {
    return {};
  }
}
