import { IAuthRequest, User } from "core_api/types";
import { Response } from "express";
import { NotFoundError, handleError } from "core_api/errors";
import { getRelationArray } from "core_api/controller";
import TasksService from "./tasks.service";

export default {
  create: async (req: IAuthRequest<User>, res: Response) => {
    try {
      const item = await TasksService.create(req.body, req.query, req.auth);
      return res.status(200).json(item);
    } catch (err) {
      return handleError(req, res, err);
    }
  },
  update: async (req: IAuthRequest<User>, res: Response) => {
    try {
      const item = await TasksService.update(
        req.params.id,
        req.body,
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
  // TODO : SECURITY
  findByID: async (req: IAuthRequest<User>, res: Response) => {
    try {
      const item = await TasksService.findById(
        req.params.id,
        [],
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
  remove: async (req: IAuthRequest<User>, res: Response) => {
    try {
      const item = await TasksService.remove(
        req.params.id,
        [],
        req.query,
        req.auth
      );
      if (!item) {
        throw new NotFoundError("no item found");
      }
      return res.status(200).end();
    } catch (err) {
      return handleError(req, res, err);
    }
  },
  paginate: async (req: IAuthRequest<User>, res: Response) => {
    try {
      const item = await TasksService.paginate([], req.query, req.auth);
      return res.status(200).json(item);
    } catch (err) {
      return handleError(req, res, err);
    }
  },
};
