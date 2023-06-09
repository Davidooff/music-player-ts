import { TypedRequestBody, platform } from "../../../config/types";
import { Response, NextFunction } from "express";
import User from "../../mongoose/models/user";
import JWTServices from "../src/jwt";

export const useCheckAccessToken = async (
  req: TypedRequestBody<{ accessToken: string; login?: string }>,
  res: Response,
  next: NextFunction
): Promise<void> => {
  if (req.body.accessToken) {
    req.body.login = JWTServices.verify(req.body.accessToken).login;
    if (req.body.login) {
      next();
    } else {
      res.status(401).send("Invalid token");
    }
  } else {
    res.status(401).send("Unauthorized");
  }
};

export const addToLibrary = (
  req: TypedRequestBody<{
    accessToken: string;
    login: string;
    originalName: string;
    platform: platform;
    link: string;
  }>,
  res: Response
): void => {
  User.findById(req.body.login)
    .exec()
    .then(async (user) => {
      let success = await user?.addToLibrary(
        req.body.originalName,
        req.body.platform,
        req.body.link
      );
      res.send({ success });
    });
};

export const removeFromLibrary = (
  req: TypedRequestBody<{
    accessToken: string;
    login: string;
    _id: string;
  }>,
  res: Response
) => {
  User.findById(req.body.login)
    .exec()
    .then(async (user) => {
      let success = await user?.removeFromLibrary(req.body._id);
      res.send({ success });
    });
};

// not using token
export const getLibrary = async (
  req: TypedRequestBody<{
    start?: number;
    end?: number;
    id: string;
  }>,
  res: Response
) => {
  let success: boolean = false;
  let library = await User.findById(req.body.id)
    .exec()
    .then(async (user) => {
      if (user) {
        success = true;
        return await user.getLibrary(req.body.start, req.body.end);
      } else {
        success = false;
        return [];
      }
    });
  res.status(success ? 200 : 404).send({ library });
};
