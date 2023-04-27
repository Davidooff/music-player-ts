import mongoose, { Schema } from "mongoose";
import { compareSync } from "bcryptjs";
import jwtService from "../../express/src/jwt";
import { hashPassword } from "../src/crypt";

interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  success: boolean;
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
      async auth(
        login: string,
        password: string,
        ip: string
      ): Promise<LoginResponse> {
        let user = this.findOne({ _id: login }).lean();
        let refreshToken = jwtService.sign({ login, ip }, "7d");
        let accessToken = jwtService.sign({ login }, "10m");
        let data = await Promise.all([user, refreshToken, accessToken]);

        if (data[0]?.password && compareSync(password, data[0].password)) {
          return {
            refreshToken: data[1],
            accessToken: data[2],
            success: true,
          };
        } else {
          return {
            success: false,
          };
        }
      },
      async register(
        login: string,
        password: string,
        ip: string
      ): Promise<LoginResponse> {
        let user = this.findOne({ _id: login }).lean();
        let refreshToken = jwtService.sign({ login, ip }, "7d");
        let accessToken = jwtService.sign({ login }, "10m");
        let password_hash = hashPassword(password);
        if (await user) {
          return {
            success: false,
            msg: "User already exists",
          };
        } else {
          return this.create({
            _id: login,
            password: await password_hash,
          })
            .then(async () => {
              return {
                success: true,
                refreshToken: await refreshToken,
                accessToken: await accessToken,
              };
            })
            .catch(async (err) => {
              return {
                success: false,
                msg: err,
              };
            })
            .finally(() => {
              return {
                success: false,
                msg: "Something went wrong",
              };
            });
        }
      },
    },
  }
);

// const userModel = mongoose.model("users", userSchema);

export default mongoose.model("users", userSchema);
