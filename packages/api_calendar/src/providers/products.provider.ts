import { ID, User } from "core_api/types";
import { fetch } from "core_api/services/internal.service";
import { Model } from "objection";

const PRODUCT_PATH = process.env.PRODUCTS_SERVICE_URL;

type Product = Model & { id: ID };

export default {
  async fetch(ids: Array<ID>, auth: User): Promise<Array<Product>> {
    // TODO : add ids to url
    const response = await fetch(`${PRODUCT_PATH}/products`, auth);
    return response.data?.results || response.data;
  },
};
