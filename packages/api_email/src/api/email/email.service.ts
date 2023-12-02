import { User } from "core_api/types";
import Configuration from "./configuration";
import { NotFoundError } from "core_api/errors";

function findConfiguration(auth: User) {
  return Configuration.query()
    .where("idAuth", auth.id)
    .first()
    .execute();
}

async function configure(body: any, auth: User) {
  const data = {
    ...body,
    idAuth: auth.id,
  };

  let item = await findConfiguration(auth);

  if (item) {
    item = await item.$query().updateAndFetchById(item.id as number, data);
  } else {
    item = await Configuration.query().insertAndFetch(data);
  }
  return item;
}

async function send(body: any, auth: User) {
  const config = await findConfiguration(auth);
  if (!config) throw new NotFoundError("configuration not found");
  return;
}

export default {
  configure,
  send,
  findConfiguration,
};
