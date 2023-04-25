import mongoose from "mongoose";
import userModel from "./models/user";
import env from "../env";

class DB {
  private static mongoose = mongoose.connect(env.DB_URL);
  public userModel = userModel;
  constructor() {
    this.init();
  }
  async init() {
    console.log(`Connecting to MongoDB at ${env.DB_URL}...`);
    await DB.mongoose;
  }
}

export default new DB();
