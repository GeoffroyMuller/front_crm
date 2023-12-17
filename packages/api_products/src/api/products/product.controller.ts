import { IAuthRequest, User } from "core_api/types";
import { Response } from "express";
import { NotFoundError, handleError } from "core_api/errors";
import { getRelationArray } from "core_api/controller";
import ProductService from "./product.service";

export default {
  findByID: async (req: IAuthRequest<User>, res: Response) => {
    try {
      const item = await ProductService.findByID(
        req.params.id,
        getRelationArray(req),
        req.query,
        req.auth
      );
      if (!item) {
        throw new NotFoundError("no item found");
      }
      return res.status(200).json(item);
    } catch (err) {
      return handleError(req, res, err);
    }
  },
  paginate: async (req: IAuthRequest<User>, res: Response) => {
    try {
      const items = await ProductService.paginate(
        getRelationArray(req),
        req.query,
        req.auth
      );
      return res.status(200).json(items);
    } catch (err) {
      return handleError(req, res, err);
    }
  },
  create: async (req: IAuthRequest<User>, res: Response) => {
    try {
      const item = await ProductService.create(req.body, req.query, req.auth);
      return res.status(200).json(item);
    } catch (err) {
      return handleError(req, res, err);
    }
  },
  update: async (req: IAuthRequest<User>, res: Response) => {
    try {
      const item = { ...req.body, id: req.params.id };
      const updatedItem = await ProductService.update(
        item,
        req.query,
        req.auth
      );
      if (!updatedItem) {
        throw new NotFoundError("no item found");
      }
      return res.status(200).json(updatedItem);
    } catch (err) {
      return handleError(req, res, err);
    }
  },
  remove: async (req: IAuthRequest<any>, res: Response) => {
    try {
      const id = req.params.id;
      const deletedItem = await ProductService.remove(id, req.query, req.auth);
      if (!deletedItem) {
        throw new NotFoundError("no item found");
      }
      return res.status(200).end();
    } catch (err) {
      return handleError(req, res, err);
    }
  },
  saveField: async (req: IAuthRequest<any>, res: Response) =>  {
    try {
      return res.status(200).json({});
    } catch (err) {
      return handleError(req, res, err);
    }
  },
  addImage: async (req: IAuthRequest<any>, res: Response) =>  {
    try {
      const id = req.params.id;
      const image = await ProductService.addImage(id, req.body, req.auth);
      if (!image) {
        throw new NotFoundError("no item found");
      }
      return res.status(200).json(image);
    } catch (err) {
      return handleError(req, res, err);
    }
  }
};
