import serviceFactory from "core_api/service";
import type { User } from "core_api/types";
import Client from "./client.model";

const clientService = serviceFactory<Client, User>(Client, {
  isAuthorized: async (model: Client | Object, user: User) => {
    return Client.fromJson(model)?.idCompany == user?.idCompany;
  },
  async onBeforeFetchList({ query, auth, filters, data }) {
    if (auth != null) {
      if (auth.idCompany) {
        query.where(Client.tableName + ".idCompany", auth.idCompany);
      }
    }
    return { query, auth, filters, data };
  },
  async onBeforeCreate({ query, auth, filters, data }) {
    return {
      query,
      auth,
      filters,
      data: {
        ...data,
        idCompany: auth.idCompany,
      },
    };
  },
  async onBeforeUpdate({ query, auth, filters, data }) {
    return {
      query,
      auth,
      filters,
      data: {
        ...data,
        idCompany: auth.idCompany,
      },
    };
  },
});

export default clientService;
