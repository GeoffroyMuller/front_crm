import { Model } from "objection";
import Project from "../projects/project.model";

export default class Section extends Model {
  id?: number;
  name?: string;
  idProject?: number;

  project?: Project;

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
