import { RelationExpression } from "objection";
import Section from "./sections.model";
import { applyRelations } from "core_api/service";
import { ID, User } from "core_api/types";
import { handleFilters } from "core_api/services/filters.service";
import Project from "./project.model";
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
    const query = Section.query().where("idCompany", auth.idCompany);
    const project = await Project.query().findById(body.idProject);
    if (project?.idCompany != auth.idCompany) {
      throw new AuthError();
    }
    delete body.id;
    const data = {
      ...body,
    };
    handleFilters(query, filters);
    return query
      .updateAndFetchById(data.id, data)
      .execute() as Promise<Section>;
  },
  remove: async (id: ID, filters: any, auth: User) => {
    const query = Section.query()
      .join(Project.tableName, `${Project.tableName}.id`, "=", `${Section.tableName}.id`)
      .where(`${Project.tableName}.idCompany`, auth.idCompany);
    handleFilters(query, filters);
    const removed = await query.where(`${Section.tableName}.id`, id).delete().execute();
    return removed;
  },
};
