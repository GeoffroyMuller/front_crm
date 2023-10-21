import { Model } from "objection";

export default class Tasks extends Model {
  id?: number;
  name?: string;
  description?: string;

  idProject?: number;
  idSection?: number;
  idUser?: number;

  static get tableName() {
    return "tasks";
  }

  static get relationMappings() {
    return {};
  }
}
