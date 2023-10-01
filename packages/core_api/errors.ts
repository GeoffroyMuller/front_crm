import { ValidationError } from "objection";
import { IAuthRequest } from "./types";
import { Response } from "express";

export class AuthError extends Error {
  constructor(msg: string = "") {
    super(msg);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, AuthError.prototype);
  }
}

export class NotFoundError extends Error {
  constructor(msg: string = "") {
    super(msg);
    // Set the prototype explicitly.
    Object.setPrototypeOf(this, NotFoundError.prototype);
  }
}

export async function handleError(
  req: IAuthRequest<any>,
  res: Response,
  err: any
) {
  if (err instanceof AuthError) {
    return res.status(401).end();
  }
  if (err instanceof ValidationError) {
    console.error(err);
    return res.status(400).json(err.data);
  }
  if (err instanceof NotFoundError) {
    return res.status(404).json(err.message);
  }
  return res.status(500).end(err.message);
}
