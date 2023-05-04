import { TypedRequestBody } from "../../../config/types";
import { Response } from "express";
import discordSkip from "../../discord/commands/src/express-skip";
import discordStart from "../../discord/commands/src/express-start";

export const skip = async (
  req: TypedRequestBody<{ id: string }>,
  res: Response
) => {
  discordSkip(req.body.id);
  global.io.emit(req.body.id, "skip");
  res.send({ success: true });
};

export const start = async (
  req: TypedRequestBody<{ id: string }>,
  res: Response
) => {
  discordStart(req.body.id);
  global.io.emit(req.body.id, "start");
  res.send({ success: true });
};
