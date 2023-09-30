import { Request, Response } from "express";
import { NotFoundError, handleError as _handleError } from "./errors";
import {
  ControllerFactory,
  ControllerHandleError,
  IAuthRequest,
} from "./types";

export function getToken(req: Request): string | undefined {
  return (
    req.headers.authorization ||
    req.cookies.token ||
    (req.query.token as string)
  );
}

const controllerFactory: ControllerFactory = (service, opts = undefined) => {
  const handleError: ControllerHandleError<any, any> =
    opts?.handleError || _handleError;

  function _getRelationArray(req: Request): string[] {
    if (Array.isArray(req.query.populate)) {
      return req.query.populate as string[];
    }
    if (typeof req.query.populate === "string") {
      return [req.query.populate];
    }
    return [];
  }

  return {
    handleError,
    paginate: async (req: IAuthRequest<any>, res: Response) => {
      try {
        const filters = req.query;
        const items = await service.paginate(
          _getRelationArray(req),
          filters,
          req.auth
        );
        return res.status(200).json(items);
      } catch (err) {
        return handleError(req, res, err);
      }
    },
    getAll: async (req: IAuthRequest<any>, res: Response) => {
      try {
        const filters = req.query;
        const items = await service.getAll(
          _getRelationArray(req),
          filters,
          req.auth
        );
        return res.status(200).json(items);
      } catch (err) {
        return handleError(req, res, err);
      }
    },
    getById: async (req: IAuthRequest<any>, res: Response) => {
      try {
        const id = req.params.id;
        const filters = req.query;
        const item = await service.getById(
          id,
          req.auth,
          _getRelationArray(req),
          filters
        );
        if (!item) {
          return res.status(404).json({
            success: 0,
            message: "Item not found",
          });
        }
        return res.status(200).json(item);
      } catch (err) {
        return handleError(req, res, err);
      }
    },
    create: async (req: IAuthRequest<any>, res: Response) => {
      try {
        const item = req.body;
        const filters = req.query;
        const createdItem = await service.create(item, req.auth, filters);
        return res.status(200).json(createdItem);
      } catch (err) {
        return handleError(req, res, err);
      }
    },
    update: async (req: IAuthRequest<any>, res: Response) => {
      try {
        const item = { ...req.body, id: req.params.id };
        const filters = req.query;
        const updatedItem = await service.update(item, req.auth, filters);
        if (!updatedItem) {
          throw new NotFoundError("no item found");
        }
        return res.status(200).json(updatedItem);
      } catch (err) {
        return handleError(req, res, err);
      }
    },
    delete: async (req: IAuthRequest<any>, res: Response) => {
      try {
        const filters = req.query;
        const id = req.params.id;
        const deletedItem = await service.remove(id, req.auth, filters);
        if (!deletedItem) {
          throw new NotFoundError("no item found");
        }
        return res.status(200).end();
      } catch (err) {
        return handleError(req, res, err);
      }
    },
  };
};

export default controllerFactory;
