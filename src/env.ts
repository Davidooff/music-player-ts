import dotenv from "dotenv";
dotenv.config();

export default {
  PORT: process.env.PORT ? Number(process.env.PORT) : 3000,
  DB_URL: process.env.DB_URL ? process.env.DB_URL : "",
  TOKEN: process.env.TOKEN,
  CLIENT_ID: process.env.CLIENT_ID,
  JWT_PRIVATE_KEY: process.env.JWT_PRIVATE_KEY,
  DEPLOY: Boolean(process.env.DEPLOY),
};
