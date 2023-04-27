import jwt from "jsonwebtoken";
import env from "../../env";

interface JwtPayload {
  ip?: string;
  login: string;
}

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

  verify(token: string): JwtPayload {
    try {
      return jwt.verify(token, this.privateKey) as JwtPayload;
    } catch (error) {
      return { login: "" };
    }
  }
}

export default new JwtService();
