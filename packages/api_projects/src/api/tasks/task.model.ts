import { Model } from "objection";

export default class Task extends Model {
  id?: number;
  name?: string;
  description?: string;
  completed?: boolean;

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
