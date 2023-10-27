import { IAuthRequest, User } from "core_api/types";
import { Response } from "express";
import { NotFoundError, handleError } from "core_api/errors";
import SectionsService from "./sections.service";
import { getRelationArray } from "core_api/controller";

export default {
  create: async (req: IAuthRequest<User>, res: Response) => {
    try {
      const item = await SectionsService.create(
        { ...req.body, idProject: req.params.idProject },
        req.query,
        req.auth
      );
      return res.status(200).json(item);
    } catch (err) {
      return handleError(req, res, err);
    }
  },
  update: async (req: IAuthRequest<User>, res: Response) => {
    try {
    
      const item = { ...req.body, id: req.params.id };
      const updatedItem = await SectionsService.update(
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
      const deletedItem = await SectionsService.remove(id, req.query, req.auth);
      if (!deletedItem) {
        throw new NotFoundError("no item found");
      }
      return res.status(200).end();
    } catch (err) {
      return handleError(req, res, err);
    }
  },
  paginate: async (req: IAuthRequest<User>, res: Response) => {
    try {
      const items = await SectionsService.paginate(
        req.params.idProject,
        getRelationArray(req),
        req.query,
        req.auth
      );
      return res.status(200).json(items);
    } catch (err) {
      return handleError(req, res, err);
    }
  }
};
