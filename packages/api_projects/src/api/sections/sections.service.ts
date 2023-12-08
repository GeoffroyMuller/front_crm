import { RelationExpression } from "objection";
import Section from "./sections.model";
import { applyRelations } from "core_api/service";
import { ID, User } from "core_api/types";
import { handleFilters } from "core_api/services/filters.service";
import Project from "../projects/project.model";
import { AuthError } from "core_api/errors";

export default {
  create: async (item: any, filters: any, auth: User) => {
    const query = Section.query();
    const project = await Project.query().findById(item.idProject);
    if (project?.idCompany != auth.idCompany) {
      throw new AuthError();
    }
    handleFilters(query, filters);
    const res = query.insert(item).execute() as Promise<Section>;
    return res;
  },
  update: async (body: any, filters: any, auth: User) => {
    const query = Section.query();
    const id = body.id;
    const project = (await Section.relatedQuery("project")
      .for([id])
      .first()) as Project;
    if (project?.idCompany != auth.idCompany) {
      throw new AuthError();
    }

    delete body.id;
    const data = {
      ...body,
    };
    handleFilters(query, filters);
    return query.updateAndFetchById(id, data).execute() as Promise<Section>;
  },
  remove: async (id: ID, filters: any, auth: User) => {
    const query = Section.query()
      .join(
        Project.tableName,
        `${Project.tableName}.id`,
        "=",
        `${Section.tableName}.idProject`
      )
      .where(`${Project.tableName}.idCompany`, auth.idCompany);
    handleFilters(query, filters);
    const removed = await query
      .where(`${Section.tableName}.id`, id)
      .delete()
      .execute();

    return removed;
  },
  paginate: async (
    idProject: ID,
    relations: RelationExpression<Section>[],
    filters: any,
    auth: User
  ) => {
    const query = applyRelations<Section>(Section.query(), Section, relations);
    query
      .join(
        Project.tableName,
        `${Project.tableName}.id`,
        "=",
        `${Section.tableName}.idProject`
      )
      .where(`${Project.tableName}.idCompany`, auth.idCompany)
      .andWhere("idProject", idProject);
    handleFilters(query, filters);
    return query.page(filters.page ? filters.page - 1 : 0, filters.pageSize || 5).execute();
  },
};
