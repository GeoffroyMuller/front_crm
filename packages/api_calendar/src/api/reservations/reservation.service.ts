import serviceFactory from "core_api/service";
import type { User } from "core_api/types";
import Reservation from "./reservation.model";
import { isPopulateNeeded } from "core_api/services/filters.service";
import productsProvider from "../../providers/products.provider";
import ReservationLine from "./reservation_line.model";

const reservationService = serviceFactory<Reservation, User>(Reservation, {
  isAuthorized: async (model: Reservation | Object, user: User) => {
    return Reservation.fromJson(model)?.idCompany == user?.idCompany;
  },
  async onBeforeFetchList({ query, auth, filters, data }) {
    if (auth != null) {
      if (auth.idCompany) {
        query.where("idCompany", auth.idCompany);
      }
    }
    return { query, auth, filters, data };
  },
  async onAfterGetById({ query, auth, filters, data }) {
    if (auth != null) {
      if (auth.idCompany) {
        query.where("idCompany", auth.idCompany);
      }
    }
    if (isPopulateNeeded(filters, "lines.product"))  {
      try {
        const products = await productsProvider.fetch([], auth);
        console.error({products})
        data.lines = (data.lines || []).map((line: ReservationLine) => {
          const product = products.find((p) => p.id == line.idProduct);
          if (product == null) return line;
          return {
            ...line,
            product,
          };
        });
        
      } catch(err) {
        console.error(err);
      }
    }
    return { query, auth, filters, data };
  },
  async onBeforeCreate({ query, auth, filters, data }) {
    delete data.client;
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
    delete data.client;
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

reservationService.create = async (body: any, auth) => {
  const { data, query } = await reservationService.onBeforeCreate({
    query: Reservation.query(),
    data: body,
    auth,
  });
  await reservationService.checkAuthorization(data, auth);
  return (await query.upsertGraphAndFetch(
    {
      ...data,
    },
    { relate: true }
  )) as unknown as Reservation;
};

reservationService.update = async (body: any, auth) => {
  const { data, query } = await reservationService.onBeforeUpdate({
    query: Reservation.query(),
    data: body,
    auth,
  });
  await reservationService.getById(data.id, auth);
  return (await query.upsertGraphAndFetch(
    {
      id: data.id,
      ...data,
    },
    { relate: true, unrelate: true }
  )) as unknown as Reservation;
};

export default reservationService;
