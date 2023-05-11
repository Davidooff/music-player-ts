import express from "express";
import http from "http";
import Socket from "../socket/main";
import { hello } from "./routes/hello";
import { login, register, checkRefreshToken } from "./routes/auth";
import {
  addLibToQueue,
  addToQueue,
  getQueue,
  refresh,
  removeFromQueue,
} from "./routes/queue";
import {
  useCheckAccessToken,
  addToLibrary,
  removeFromLibrary,
  getLibrary,
} from "./routes/library";
import cookieparser from "cookie-parser";
import { play } from "./routes/play";
import { skip, start, stop } from "./routes/player";
import cors from "cors";

var corsOptions = {
  origin: "*",
  methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

class App {
  public app: express.Application;
  public server: any;
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    global.io = new Socket(this.server).io;
    this.config();
    this.routs();
  }

  private routs(): void {
    this.app.get("/", hello);

    this.app.post("/auth/register", register);
    this.app.post("/auth/login", login);
    this.app.post("/auth/refresh", checkRefreshToken);

    this.app.use("/library", useCheckAccessToken);
    this.app.post("/library/add", addToLibrary);
    this.app.post("/library/remove", removeFromLibrary);

    this.app.post("/play", play);
    this.app.post("/get/library", getLibrary);

    this.app.use("/queue", refresh); // sending "refresh" by socket.io
    this.app.post("/queue/add", addToQueue);
    this.app.post("/queue/remove", removeFromQueue);
    this.app.post("/queue/addLib", addLibToQueue);
    this.app.post("/get/queue", getQueue);

    this.app.post("/discord/skip", skip);
    this.app.post("/discord/stop", stop);
    this.app.post("/discord/start", start);
  }

  private config(): void {
    // support application/json type post data
    this.app.use(express.json());
    // suport using cookies
    this.app.use(cookieparser());

    this.app.use(cors(corsOptions));
    // accepting proxy for checking ip
    this.app.enable("trust proxy");
  }
}

export default new App().server;
