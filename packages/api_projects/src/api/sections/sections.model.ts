import { Model } from "objection";
import Project from "../projects/project.model";
import Task from "../tasks/task.model";

export default class Section extends Model {
  id?: number;
  name?: string;
  idProject?: number;

  project?: Project;
  tasks?: Task[];

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
      tasks: {
        relation: Model.HasManyRelation,
        modelClass: Task,
        join: {
          from: Section.tableName + ".id",
          to: Task.tableName + ".idSection",
        },
      },
    };
  }
}
