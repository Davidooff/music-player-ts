import { TypedRequestBody } from "../../../config/types";
import { Request, Response } from "express";
import musicStreaming from "../../music-streaming/main";

export const play = (req: Request, res: Response) => {
  let astream = musicStreaming.getStream("youtube", req.body.link);
  astream
    .on("data", (chunk) => {
      console.log("Data chunck received >> ", chunk);
    })
    .pipe(res);
  astream.on("error", (err) => {
    console.log("Error >> ", err);
  });
};
