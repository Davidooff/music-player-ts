import jwt from "jsonwebtoken";
import env from "../../env";

class JwtService {
  private privateKey: string;
  constructor() {
    if (env.JWT_PRIVATE_KEY) {
      this.privateKey = env.JWT_PRIVATE_KEY;
    } else {
      throw new Error("JWT_PRIVATE_KEY is not defined");
    }
  }

  async sign(payload: any, expiresIn: string | number): Promise<string> {
    return jwt.sign(payload, this.privateKey, { expiresIn });
  }

  verify(token: string) {
    return jwt.verify(token, this.privateKey);
  }
}

export default new JwtService();
