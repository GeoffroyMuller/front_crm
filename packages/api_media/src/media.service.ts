import { ID, User } from "core_api/types";
import Media from "./media.model";
import { NotFoundError } from "core_api/errors";
import { applyRelations } from "core_api/service";
import { handleFilters } from "core_api/services/filters.service";

async function findById(id: ID, auth: User) {
  const media = await Media.query()
    .where("id", id)
    .andWhere("idCompany", auth.idCompany)
    .first();
  if (!media) throw new NotFoundError();
  return media;
}

async function find(filters: any, auth: Pick<User, 'idCompany'>) {
  const query = handleFilters<Media>(Media.query(), filters);
  return query
    .where("idCompany", auth.idCompany)
    .page(filters.page ? filters.page - 1 : 0, filters.pageSize || 100)
    .execute();
}

export default {
  findById,
  find
};
