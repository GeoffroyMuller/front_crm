import { RelationExpression } from "objection";
import Project from "./project.model";
import { applyRelations } from "core_api/service";
import { ID, User } from "core_api/types";
import { handleFilters } from "core_api/services/filters.service";

export default {
  findByID: async (
    id: ID,
    relations: RelationExpression<Project>[],
    filters: any,
    auth: User
  ) => {
    const query = applyRelations(Project.query(), Project, relations);
    query.where('id', id).where("idCompany", auth.idCompany);
    handleFilters(query, filters);
    return query.first().execute();
  },
  paginate: async (
    relations: RelationExpression<Project>[],
    filters: any,
    auth: User
  ) => {
    const query = applyRelations<Project>(Project.query(), Project, relations);
    query.where("idCompany", auth.idCompany);
    query.page(filters.page ? filters.page - 1 : 0, filters.pageSize || 5);
    handleFilters(query, filters);
    return query.execute() as Promise<[]>;
  },
  create: async (item: any, filters: any, auth: User) => {
    const query = Project.query();
    const data: Project = {
      ...item,
      idCompany: auth.idCompany,
    };
    handleFilters(query, filters);
    const res = query.insert(data).execute() as Promise<Project>;
    return res;
  },
  update: async (body: any, filters: any, auth: User) => {
    const query = Project.query().where("idCompany", auth.idCompany);
    const id = body.id;
    delete body.id;
    const data = {
      ...body,
      idCompany: auth.idCompany,
    };
    handleFilters(query, filters);
    return query
      .updateAndFetchById(id, data)
      .execute() as Promise<Project>;
  },
  remove: async (id: ID, filters: any, auth: User) => {
    const query = Project.query().where("idCompany", auth.idCompany);
    handleFilters(query, filters);
    const removed = await query.where("id", id).delete().execute();
    return removed;
  },
};
