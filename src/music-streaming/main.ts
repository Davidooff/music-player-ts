import { platform } from "../../config/types";
import { Readable } from "stream";

import ytdl from "ytdl-core";

class Main {
  constructor() {
    this.init();
  }
  init() {}

  getStream(platform: platform, link: string): Readable {
    switch (platform) {
      case "youtube":
        return ytdl(link, { filter: "audioonly" });
        break;
      default:
        throw new Error("Invalid platform");
    }
  }
}

export default new Main();
