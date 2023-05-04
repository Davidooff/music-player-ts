import { hashSync } from "bcryptjs";

export async function hashPassword(password: string): Promise<string | Error> {
  return hashSync(password, 8);
}
