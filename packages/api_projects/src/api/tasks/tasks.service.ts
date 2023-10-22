import { User } from "core_api/types";
import { RelationExpression } from "objection";
import Task from "./task.model";
import { AuthError } from "core_api/errors";
import { handleFilters } from "core_api/services/filters.service";
import Project from "../projects/project.model";
import Section from "../projects/sections.model";
import { notifyUsers } from "core_api/services/realtime.service";

export default {
  create: async (item: Partial<Task>, filters: any, auth: User) => {
    const query = Task.query();
    const data = { ...item };
    if (data.idSection) {
      const project = await Section.relatedQuery<Project>("project")
        .for([data.idSection])
        .first();
      if (project?.idCompany != auth.idCompany) {
        throw new AuthError();
      }
      data.idProject = project?.id;
    } else if (data.idProject) {
      const project = await Project.query().findById(data.idProject);
      if (project?.idCompany != auth.idCompany) {
        throw new AuthError();
      }
    } else {
      data.idUser = auth.id;
    }
    handleFilters(query, filters);
    const res = await query.insert(data).execute();
    // here to test realtime
    notifyUsers('createTask', res, []);
    return res;
  },
};
