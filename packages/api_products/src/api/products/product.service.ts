import { RelationExpression } from "objection";
import Product from "./product.model";
import { applyRelations } from "core_api/service";
import { ID, User } from "core_api/types";
import { handleFilters } from "core_api/services/filters.service";

export default {
  findByID: async (
    id: ID,
    relations: RelationExpression<Product>[],
    filters: any,
    auth: User
  ) => {
    const query = applyRelations(Product.query(), Product, relations);
    query.where('id', id).where("idCompany", auth.idCompany);
    handleFilters(query, filters);
    return query.first().execute() as Promise<Product | undefined>;
  },
  paginate: async (
    relations: RelationExpression<Product>[],
    filters: any,
    auth: User
  ) => {
    const query = applyRelations<Product>(Product.query(), Product, relations);
    query.where("idCompany", auth.idCompany);
    query.page(filters.page ? filters.page - 1 : 0, filters.pageSize || 5);
    handleFilters(query, filters);
    return query.execute() as Promise<[]>;
  },
  create: async (item: any, filters: any, auth: User) => {
    const query = Product.query();
    const data: Product = {
      ...item,
      idCompany: auth.idCompany,
    };
    handleFilters(query, filters);
    const res = query.insert(data).execute() as Promise<Product>;
    return res;
  },
  update: async (body: any, filters: any, auth: User) => {
    const query = Product.query().where("idCompany", auth.idCompany);
    const id = body.id;
    delete body.id;
    const data = {
      ...body,
      idCompany: auth.idCompany,
    };
    handleFilters(query, filters);
    return query
      .updateAndFetchById(id, data)
      .execute() as Promise<Product>;
  },
  remove: async (id: ID, filters: any, auth: User) => {
    const query = Product.query().where("idCompany", auth.idCompany);
    handleFilters(query, filters);
    const removed = await query.where("id", id).delete().execute();
    return removed;
  },
};
