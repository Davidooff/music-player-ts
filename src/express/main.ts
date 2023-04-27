import express from "express";
import { hello } from "./routes/hello";
import { login, register, checkRefreshToken } from "./routes/auth";
import cookieparser from "cookie-parser";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routs();
  }

  private routs(): void {
    this.app.get("/", hello);
    this.app.post("/auth/register", register);
    this.app.post("/auth/login", login);
    this.app.post("/auth/refresh", checkRefreshToken);
  }

  private config(): void {
    // support application/json type post data
    this.app.use(express.json());
    // suport using cookies
    this.app.use(cookieparser());
    // accepting proxy for checking ip
    this.app.enable("trust proxy");
  }
}

export default new App().app;
