import { TypedRequestBody } from "../../../config/types";
import { NextFunction, Response } from "express";
import { queueModel, QueueEl } from "../../mongoose/models/queue";
import user from "../../mongoose/models/user";

export const addToQueue = async (
  req: TypedRequestBody<{ id: string; add: QueueEl }>,
  res: Response
) => {
  let success = await queueModel
    .findById(req.body.id)
    .exec()
    .then(async (queue) => {
      if (!queue) return res.status(404).send({ error: "No queue found" });
      return await queue.addToQueue(
        req.body.add.originalName,
        req.body.add.platform,
        req.body.add.link
      );
    });
  res.send();
};

export const removeFromQueue = async (
  req: TypedRequestBody<{ id: string; itemId: string }>,
  res: Response
) => {
  let success = await queueModel.findById(req.body.id).then(async (queue) => {
    return await queue?.removeFromQueue(req.body.itemId);
  });
  if (success) {
    res.send();
  } else res.status(404).send();
};

export const getQueue = async (
  req: TypedRequestBody<{ id: string; start?: number; end?: number }>,
  res: Response
) => {
  let data = await queueModel
    .findById(req.body.id)
    .exec()
    .then(async (queue) => {
      return await queue?.getQueue(req.body.start, req.body.end);
    });
  if (data) {
    res.send({ queue: data });
  } else res.status(404).send();
};

export const refresh = async (
  req: TypedRequestBody<{ id: string }>,
  res: Response,
  next: NextFunction
) => {
  // await queue.findById(req.body.id).then(async (queue) => {
  //   if (!queue) {
  //     start(id)
  //   }
  // })
  global.io.emit(req.body.id, "refresh");
  next();
};

export const addLibToQueue = async (
  req: TypedRequestBody<{ id: string; userId: string }>,
  res: Response
) => {
  let add = user.findById(req.body.userId).lean();
  let moveTo = queueModel.findById(req.body.id).exec();
  let success = await Promise.all([add, moveTo]).then(async (data) => {
    if (!data[0] || !data[1]) return false;
    else {
      data[1].queue.push(...data[0].library);
      await data[1].save();
      return true;
    }
  });
  res.status(200).send();
};
