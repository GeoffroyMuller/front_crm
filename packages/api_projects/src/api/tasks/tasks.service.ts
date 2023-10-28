import { ID, User } from "core_api/types";
import { RelationExpression } from "objection";
import Task from "./task.model";
import { AuthError } from "core_api/errors";
import { handleFilters } from "core_api/services/filters.service";
import Project from "../projects/project.model";
import Section from "../sections/sections.model";
import { notifyUsers } from "core_api/services/realtime.service";
import { applyRelations } from "core_api/service";
import projectService from "../projects/project.service";

export default {
  create: async (item: Partial<Task>, filters: any, auth: User) => {
    const query = Task.query();
    const data = { ...item };
    let project: Project | undefined;
    if (data.idSection) {
      project = await Section.relatedQuery<Project>("project")
        .for([data.idSection])
        .first();
      if (project?.idCompany != auth.idCompany) {
        throw new AuthError();
      }
      data.idProject = project?.id;
    } else if (data.idProject) {
      project = await Project.query().findById(data.idProject);
      if (project?.idCompany != auth.idCompany) {
        throw new AuthError();
      }
    } else {
      data.idUser = auth.id;
    }
    handleFilters(query, filters);
    const res = await query.insert(data).execute();

    /* try {
      if (project?.id) {
        notifyUsers("createTask", res, []);
      }
    } catch (err) {
      console.error(err);
    } */

    return res;
  },
  findById: async (
    id: ID,
    relations: RelationExpression<Task>[],
    filters: any,
    auth: User
  ) => {
    const query = applyRelations(Task.query(), Task, relations);
    query.where("id", id);
    handleFilters(query, filters);
    const item = (await query.first().execute()) as Task;
    if (!item) return null;
    if (item.idUser) {
      if (item.idUser == auth.id) return item;
      return null;
    }
    let project: undefined | Project;
    if (item.idProject) {
      project = (await projectService.findByID(
        item.idProject,
        [],
        {},
        auth
      )) as Project;
    }
    if (item.idSection) {
      project = await Section.relatedQuery("project")
        .for([item.idSection])
        .first();
    }
    if (!project || project.idCompany != auth.idCompany) return null;
    return item;
  },
};
