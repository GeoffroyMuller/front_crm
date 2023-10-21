import { Model } from "objection";

export default class Section extends Model {
  id?: number;
  name?: string;
  idProject?: number;

  static get tableName() {
    return "sections";
  }

  static get relationMappings() {
    return {};
  }
}
