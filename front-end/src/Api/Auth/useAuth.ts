import axios from "axios";
import { UserPayload } from "../../Types/Auth/Auth";

const URL = "http://localhost:3000";

export default axios.create({
  baseURL: URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});
