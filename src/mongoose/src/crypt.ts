import { hash } from "bcryptjs";

export async function hashPassword(password: string): Promise<string | Error> {
  try {
    hash(password, 8, function (err, hash) {
      if (err) {
        return err;
      } else {
        return hash;
      }
    });
  } finally {
    return new Error("Unexpected error");
  }
}
