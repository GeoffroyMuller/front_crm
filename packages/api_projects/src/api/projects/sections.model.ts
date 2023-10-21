import { Model } from "objection";
import Project from "./project.model";

export default class Section extends Model {
  id?: number;
  name?: string;
  idProject?: number;

  static get tableName() {
    return "sections";
  }

  static get relationMappings() {
    return {
      project: {
        relation: Model.BelongsToOneRelation,
        modelClass: Project,
        join: {
          from: Section.tableName + ".idProject",
          to: Project.tableName + ".id",
        },
      },
    };
  }
}
