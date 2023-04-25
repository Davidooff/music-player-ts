import express from "express";
import { hello } from "./routs/hello";
import { auth, register } from "./routs/auth";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.routs();
  }

  private routs(): void {
    this.app.get("/", hello);
    this.app.post("/register", register);
    this.app.post("/auth", auth);
  }

  private config(): void {
    // support application/json type post data
    this.app.use(express.json());
  }
}

export default new App().app;
