// @DEPRECATED

import {
  Model,
  ModelClass,
  QueryBuilder,
  QueryBuilderType,
  RelationExpression,
} from "objection";
import filtersService from "./services/filters.service";
import { ServiceFactoryOptions, Service, ID } from "./types";
import { AuthError } from "./errors";

export function isRelationExists<T extends Model>(
  model: ModelClass<T>,
  relation: string
): boolean {
  // TODO: check existence of relation of this type too
  if (relation.includes("[")) return true;
  const split = relation.split(".");
  // @ts-ignore
  if (model.relationMappings[split[0]] == null || split.length > 4)
    return false;
  if (split.length === 1) {
    return true;
  }
  return isRelationExists(
    // @ts-ignore
    model.relationMappings[split[0]].modelClass,
    split.slice(1).join(".")
  );
}

export function applyRelations<T extends Model>(
  query: QueryBuilderType<T>,
  model: ModelClass<T>,
  relations: any
): QueryBuilderType<T> {
  if (!Array.isArray(relations)) return query;
  for (const relation of relations) {
    if (isRelationExists(model, relation)) {
      query.withGraphFetched(relation);
    }
  }
  return query;
}

const serviceFactory = <
  T extends Model,
  AuthModel extends Model | unknown = unknown
>(
  model: ModelClass<T>,
  opts?: ServiceFactoryOptions<T, AuthModel>
): Service<T, AuthModel> => {
  const handleFilters = opts?.handleFilters || filtersService.handleFilters;
  const isAuthorized = opts?.isAuthorized || (() => true);

  const onBeforeCreate = opts?.onBeforeCreate || (async (params) => params);
  const onBeforeFetchList =
    opts?.onBeforeFetchList || (async (params) => params);
  const onBeforeUpdate = opts?.onBeforeUpdate || (async (params) => params);
  const onBeforeGetById = opts?.onBeforeGetById || (async (params) => params);
  const onBeforeRemove = opts?.onBeforeRemove || (async (params) => params);

  const onAfterCreate = opts?.onAfterCreate || (async (params) => params);
  const onAfterGetById = opts?.onAfterGetById || (async (params) => params);

  async function checkAuthorization(model: T, auth: any) {
    if (!(await isAuthorized(model, auth))) {
      throw new AuthError();
    }
  }

  const getById = async (
    id: ID,
    auth: any,
    relations?: RelationExpression<T>[],
    filters?: any
  ) => {
    const query = applyRelations<T>(model.query(), model, relations);

    const { query: q, filters: f } = await onBeforeGetById({
      query,
      filters,
      auth,
    });
    handleFilters(q, f);
    let result = await q.findById(id).execute();
    await checkAuthorization(result as T, auth);
    const { data: res } = await onAfterGetById({
      query,
      filters,
      auth,
      data: result,
    });
    return res as T;
  };

  return {
    isAuthorized,
    checkAuthorization,
    onBeforeCreate,
    onBeforeFetchList,
    onBeforeGetById,
    onBeforeRemove,
    onBeforeUpdate,
    onAfterCreate,
    getById,
    handleFilters,
    getAll: async (
      relations: RelationExpression<T>[],
      filters: any,
      auth: any
    ) => {
      const query = applyRelations<T>(model.query(), model, relations);
      const { query: q, filters: f } = await onBeforeFetchList({
        query,
        filters,
        auth,
      });
      handleFilters(q, f);
      return q.execute() as Promise<T[]>;
    },
    paginate: async (
      relations: RelationExpression<T>[],
      filters: any,
      auth: any
    ) => {
      const query = applyRelations<T>(model.query(), model, relations);
      const { query: q, filters: f } = await onBeforeFetchList({
        query,
        filters,
        auth,
      });
      q.page(f.page ? f.page - 1 : 0, f.pageSize || 5);
      handleFilters(q, f);
      return q.execute() as Promise<T[]>;
    },

    create: async (item: any, auth: any, filters: any) => {
      const { data, query } = await onBeforeCreate({
        query: model.query(),
        data: item,
        auth,
      });
      handleFilters(query, filters);
      const res = query.insert(data).execute() as Promise<T>;
      const { data: result } = await onAfterCreate({
        query: model.query(),
        data: res,
        auth,
      });
      return result;
    },
    update: async (body: any, auth: any, filters: any) => {
      const { data, query } = await onBeforeUpdate({
        query: model.query(),
        data: body,
        auth,
      });
      getById(data.id, auth);
      handleFilters(query, filters);
      return query.updateAndFetchById(data.id, data).execute() as Promise<T>;
    },
    remove: async (id: ID, auth: any, filters: any) => {
      const { query, data } = await onBeforeRemove({
        query: model.query(),
        data: { id },
        auth,
      });
      handleFilters(query, filters);
      getById(data.id, auth);
      const removed = await query.where("id", id).delete().execute();
      return true;
    },
  };
};

export default serviceFactory;
