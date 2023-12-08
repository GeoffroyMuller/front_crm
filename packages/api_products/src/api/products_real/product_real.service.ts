import { RelationExpression } from "objection";
import ProductReal from "./product_real.model";
import { applyRelations } from "core_api/service";
import { ID, User } from "core_api/types";
import { handleFilters } from "core_api/services/filters.service";
import Product from "../products/product.model";
import productService from "../products/product.service";
import { AuthError, NotFoundError } from "core_api/errors";
import ProductRealField from "./product_real_field.model";
import ProductField from "../products/product_field.model";

async function findByID(
  id: ID,
  relations: RelationExpression<ProductReal>[],
  filters: any,
  auth: User
) {
  const query = applyRelations(ProductReal.query(), ProductReal, relations);
  query
    .where(`${ProductReal.tableName}.id`, id)
    .join(
      Product.tableName,
      `${Product.tableName}.id`,
      "=",
      `${ProductReal.tableName}.idProduct`
    )
    .where(`${Product.tableName}.idCompany`, auth.idCompany);
  handleFilters(query, filters);
  const product = (await query.first().execute()) as ProductReal;
  if (product == null) throw new NotFoundError();
  return product;
}

export default {
  findByID,
  paginate: async (
    relations: RelationExpression<ProductReal>[],
    filters: any,
    auth: User
  ) => {
    const query = applyRelations<ProductReal>(
      ProductReal.query(),
      ProductReal,
      relations
    );
    query
      .join(
        Product.tableName,
        `${Product.tableName}.id`,
        "=",
        `${ProductReal.tableName}.idProduct`
      )
      .where(`${Product.tableName}.idCompany`, auth.idCompany);
    handleFilters(query, filters);
    return query
      .page(filters.page ? filters.page - 1 : 0, filters.pageSize || 5)
      .execute();
  },
  create: async (item: Partial<ProductReal>, filters: any, auth: User) => {
    const query = ProductReal.query();
    if (item.idProduct == null) {
      throw new Error("No product selected");
    }
    const product = await productService.findByID(
      item.idProduct,
      ["product_fields"],
      {},
      auth
    );
    if (product == null) {
      throw new Error("No product selected");
    }
    if (item.product_real_fields && Array.isArray(item.product_real_fields)) {
      const productFields = product.product_fields || [];
      if (
        item.product_real_fields.find(
          (prf) => !productFields.find((pf) => pf.id == prf.idProductField)
        )
      ) {
        throw new Error();
      }
      // @ts-ignore
      item.product_real_fields = item.product_real_fields.map((prf) => ({
        idProductReal: prf.idProductField,
        idProductField: prf.idProductField,
        value: JSON.stringify(prf.value || ""),
      }));
    }

    const res = query
      .insertGraphAndFetch(item)
      .execute() as Promise<ProductReal>;
    return res;
  },
  update: async (body: any, filters: any, auth: User) => {
    const id = body.id;
    if (id == null) throw new Error("no id provided");
    const item = await findByID(id, ["product_real_fields"], {}, auth);
    if (item == null) throw new NotFoundError();
    delete body.idProduct;
    if (Array.isArray(body.product_real_fields)) {
      if (
        body.product_real_fields.find(
          (prf: ProductRealField) =>
            !(item.product_real_fields || []).find((p) => p.id == prf.id)
        )
      ) {
        throw new Error();
      }
      body.product_real_fields = body.product_real_fields.map(
        (prf: ProductRealField) => ({
          idProductReal: prf.idProductField,
          idProductField: prf.idProductField,
          value: JSON.stringify(prf.value || ""),
        })
      );
    }
    const query = ProductReal.query();
    return query
      .upsertGraphAndFetch([body])
      .first()
      .execute() as Promise<ProductReal>;
  },
  remove: async (id: ID, filters: any, auth: User) => {
    const item = await findByID(id, [], {}, auth);
    if (item == null) throw new NotFoundError();
    return await ProductReal.query().where("id", id).delete().execute();
  },
};
