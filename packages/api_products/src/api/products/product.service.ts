import { RelationExpression } from "objection";
import Product from "./product.model";
import { applyRelations } from "core_api/service";
import { ID, User } from "core_api/types";
import { handleFilters } from "core_api/services/filters.service";
import ProductField from "./product_field.model";
import { NotFoundError } from "core_api/errors";
import ProductImage from "./product_image.model";

import { getMediaService } from "grpcservice/clients/media.client";

const getGRPCDeadline = () => Date.now() + 500;

async function findByID(
  id: ID,
  relations: RelationExpression<Product>[],
  filters: any,
  auth: User
): Promise<Product | undefined> {
  return new Promise(async (resolve) => {
    const query = applyRelations(Product.query(), Product, relations);
    query.where("id", id).where("idCompany", auth.idCompany);
    handleFilters(query, filters);
    const product = (await query.first().execute()) as Product | undefined;

    if (filters?.populate?.includes?.("images") && product) {
      getMediaService().Find(
        { auth, model: "product", modelId: id },
        { deadline: getGRPCDeadline() },
        // @ts-ignore
        (error, result) => {
          if (error) {
            console.error("An error has occured", error);
            resolve(product);
          }
          if (result.data) {product.images = result.data;}
          resolve(product);
        }
      );
    }
  });
}
export default {
  findByID,
  paginate: async (
    relations: RelationExpression<Product>[],
    filters: any,
    auth: User
  ) => {
    const query = applyRelations<Product>(Product.query(), Product, relations);
    handleFilters(query, filters);
    return query
      .where("idCompany", auth.idCompany)
      .page(filters.page ? filters.page - 1 : 0, filters.pageSize || 5)
      .execute();
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
    return query.updateAndFetchById(id, data).execute() as Promise<Product>;
  },
  remove: async (id: ID, filters: any, auth: User) => {
    const query = Product.query().where("idCompany", auth.idCompany);
    handleFilters(query, filters);
    const removed = await query.where("id", id).delete().execute();
    return removed;
  },
  saveFields: async (
    id: ID,
    body: Array<Partial<ProductField>>,
    filters: any,
    auth: User
  ) => {
    const product = await findByID(id, ["product_fields"], {}, auth);
    if (!product) throw new NotFoundError();

    const trx = await ProductField.startTransaction();
    body.map((pf) => {
      ProductField.query(trx).update(pf);
    });
    try {
      return await trx.commit();
    } catch (err) {
      await trx.rollback();
      throw err;
    }
  },
  addImage: async (id: ID, data: Partial<ProductImage>, auth: User) => {
    const product = await findByID(id, [], {}, auth);
    if (product) {
      return ProductImage.query().insertAndFetch({
        ...data,
        idProduct: product.id,
      });
    }
    return null;
  },
  deleteImage: async (id: ID, idImage: number, auth: User) => {
    const product = await findByID(id, [], {}, auth);
    if (product) {
      return ProductImage.query()
        .where("idProduct", product.id as number)
        .andWhere("id", idImage)
        .delete();
    }
    return null;
  },
};
