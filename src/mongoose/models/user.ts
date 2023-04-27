import mongoose, { Model, Schema, Types } from "mongoose";
import { compareSync } from "bcryptjs";
import jwtService from "../../express/src/jwt";
import { hashPassword } from "../src/crypt";

interface LoginResponse {
  accessToken?: string;
  refreshToken?: string;
  success: boolean;
  msg?: string;
}

interface IUser {
  _id: string;
  password: string;
  library: [
    {
      originalName: string;
      platform: string;
      link: string;
      // _id: Types.ObjectId;
    }
  ];
  date: { type: Date };
}

// Put all user instance methods in this interface:
interface IUserMethods {
  addToLibrary(
    originalName: string,
    platform: string,
    link: string
  ): Promise<boolean>;
  removeFromLibrary(id: string): Promise<boolean>;
}

// Create a new Model type that knows about IUserMethods...
type UserModel = Model<IUser, {}, IUserMethods>;

// And a schema that knows about IUserMethods

const userSchema = new Schema<IUser, UserModel, IUserMethods>(
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
    // methods: {
    // async moveInLibrary(id, direction) {
    //   let index = this.library.findIndex((e) => e._id == id);
    //   let newIndex = direction;
    //   if (newIndex < 0) {
    //     newIndex = 0;
    //   } else if (newIndex > this.library.length - 1) {
    //     newIndex = this.library.length - 1;
    //   }
    //   let tmp = this.library[index];
    //   this.library[index] = this.library[newIndex];
    //   this.library[newIndex] = tmp;
    //   return this.save();
    // },
    // },
  }
);

userSchema.method(
  "addToLibrary",
  async function addToLibrary(
    originalName: string,
    platform: string,
    link: string
  ): Promise<boolean> {
    try {
      await this.updateOne({
        $push: {
          library: {
            originalName,
            platform,
            link,
          },
        },
      });

      return true;
    } catch {
      return false;
    }
  }
);

userSchema.method("removeFromLibrary", async function removeFromLibrary(id) {
  try {
    await this.updateOne({
      $pull: {
        library: {
          _id: id,
        },
      },
    });
    return true;
  } catch {
    return false;
  }
});

// const userModel = mongoose.model("users", userSchema);

export default mongoose.model("users", userSchema);
