export interface TypedRequestBody<T> extends Express.Request {
  cookies: {
    jwt: string;
  };
  ip: string;
  body: T;
}

export type platform = "youtube" | "soundcloud" | "spotify";
