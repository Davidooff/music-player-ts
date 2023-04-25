import { Response } from "express";
import { TypedRequestBody } from "../../../config/types";

export const hello = async (
  req: TypedRequestBody<{ name: string }>,
  res: Response
) => {
  res.send(`Hello ${req.body.name}!`);
};
