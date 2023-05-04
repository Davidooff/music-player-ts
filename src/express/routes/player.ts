import { TypedRequestBody } from "../../../config/types";
import { Response } from "express";
import discordSkip from "../../discord/commands/src/express-skip";

export const skip = async (
  req: TypedRequestBody<{ id: string }>,
  res: Response
) => {
  discordSkip(req.body.id);
  global.io.emit(req.body.id, "skip");
  res.send({ success: true });
};
