import mongoose, { Schema } from "mongoose";
import { compareSync } from "bcryptjs";
import jwtService from "../../express/src/jwt";
import { hashPassword } from "../src/crypt";

interface LoginResponse {
  token: string;
  msg?: string;
}

const userSchema = new Schema(
  {
    _id: String,
    password: String,
    library: [
      {
        originalName: String,
        platform: String,
        link: String,
      },
    ],
    date: { type: Date, default: Date.now },
  },
  {
    statics: {
      async auth(login: string, password: string): Promise<LoginResponse> {
        let user = this.findOne({ _id: login }).lean();
        let token = jwtService.sign({ login }, "1h");
        let data = await Promise.all([user, token]);

        if (data[0]?.password && compareSync(password, data[0].password)) {
          return {
            token: data[1],
          };
        } else {
          return {
            token: "",
            msg: "Wrong password",
          };
        }
      },
      async register(login: string, password: string): Promise<LoginResponse> {
        let user = this.findOne({ _id: login }).lean();
        let token = jwtService.sign({ login }, "1h");
        let password_hash = hashPassword(password);
        if (await user) {
          return {
            token: "",
            msg: "User already registered",
          };
        } else {
          let user = this.create({
            _id: login,
            password: await password_hash,
          });
          return {
            token: await token,
          };
        }
      },
    },
  }
);

// const userModel = mongoose.model("users", userSchema);

export default mongoose.model("users", userSchema);
