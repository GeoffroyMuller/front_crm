import serviceFactory from "core_api/service";
import type { User } from "core_api/types";
import Vat from "./vat.model";

const vatService = serviceFactory<Vat, User>(Vat, {
  isAuthorized: async (model: Vat | Object, user: User) => {
    return Vat.fromJson(model)?.idCompany == user?.idCompany;
  },
  async onBeforeFetchList({ query, auth, filters, data }) {
    if (auth != null) {
      if (auth.idCompany) {
        query.where(Vat.tableName + ".idCompany", auth.idCompany);
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

export default vatService;
