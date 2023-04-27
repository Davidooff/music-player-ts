import { TypedRequestBody } from "../../../config/types";
import { NextFunction, Response } from "express";
import { queue, QueueEl } from "../../mongoose/models/queue";

export const addToQueue = async (
  req: TypedRequestBody<{ id: string; add: QueueEl }>,
  res: Response
) => {
  let success = await queue
    .findById(req.body.id)
    .exec()
    .then(async (queue) => {
      if (!queue) return res.send({ success: false, error: "No queue found" });
      return await queue.addToQueue(
        req.body.add.originalName,
        req.body.add.platform,
        req.body.add.link
      );
    });
  res.send({ success });
};

export const removeFromQueue = async (
  req: TypedRequestBody<{ id: string; itemId: string }>,
  res: Response
) => {
  let success = await queue.findById(req.body.id).then(async (queue) => {
    return await queue?.removeFromQueue(req.body.itemId);
  });
  res.send({ success });
};

export const getQueue = async (
  req: TypedRequestBody<{ id: string; start?: number; end?: number }>,
  res: Response
) => {
  let data = await queue
    .findById(req.body.id)
    .exec()
    .then(async (queue) => {
      // console.log(queue);
      return await queue?.getQueue(req.body.start, req.body.end);
    });
  res.send(data);
};

export const refresh = async (
  req: TypedRequestBody<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  global.io.emit(req.body.id, "refresh");
  next();
};
