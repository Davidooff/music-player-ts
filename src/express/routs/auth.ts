import { Response } from "express";
import { TypedRequestBody } from "../../../config/types";
import db from "../../mongoose/db";

export const auth = async (
  req: TypedRequestBody<{ id: string; password: string }>,
  res: Response
) => {
  res.send(await db.userModel.auth(req.body.id, req.body.password));
};

export const register = async (
  req: TypedRequestBody<{ id: string; password: string }>,
  res: Response
) => {
  res.send(await db.userModel.register(req.body.id, req.body.password));
};
