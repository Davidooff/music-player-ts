import { Response } from "express";
import { TypedRequestBody } from "../../../config/types";
import db from "../../mongoose/db";
import jwtService from "../src/jwt";

export const login = async (
  req: TypedRequestBody<{ id: string; password: string }>,
  res: Response
) => {
  let data = await db.userModel.auth(req.body.id, req.body.password, req.ip);
  if (data.success) {
    let refreshToken = data.refreshToken;
    delete data.refreshToken;
    res.cookie("jwt", refreshToken, {
      sameSite: "none", //only dev
      secure: true, //only dev
      // httpOnly: true,
      // secure: true,
      // sameSite: "strict", // or 'Lax', it depends
      maxAge: 604800000, // 7 days
    });
    res.send(data);
  } else {
    res.send(data);
  }
};

export const register = async (
  req: TypedRequestBody<{ id: string; password: string }>,
  res: Response
) => {
  console.log(req.ip);
  let data = await db.userModel.register(
    req.body.id,
    req.body.password,
    req.ip
  );
  console.log(data);

  if (data.success) {
    res.cookie("jwt", data.refreshToken, {
      sameSite: "none", //only dev
      secure: true, //only dev
      // httpOnly: true,
      // secure: true,
      // sameSite: "strict", // or 'Lax', it depends
      maxAge: 604800000, // 7 days
    });
    delete data.refreshToken;
    res.send(data);
  } else {
    res.send(data);
  }
};

export const checkRefreshToken = async (
  req: TypedRequestBody<{ token: string }>,
  res: Response<{ success: boolean; token?: string }>
) => {
  // let jwtCookie = jwtService.verify(req.body.token);
  console.log(req.cookies.jwt);

  let jwtCookie = jwtService.verify(req.cookies.jwt);
  if (jwtCookie && jwtCookie.ip == req.ip) {
    res.send({
      success: true,
      token: await jwtService.sign({ login: jwtCookie.login }, "10m"),
    });
  } else {
    res.send({ success: false });
  }
};
