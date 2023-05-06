import {
  AudioResource,
  createAudioResource,
  createAudioPlayer,
} from "@discordjs/voice";
import { queueModel, QueueEl } from "../../../mongoose/models/queue";
import musicStream from "../../../music-streaming/main";
import { platform } from "../../../../config/types";

export default async function createAudio(
  arg: string | QueueEl
): Promise<AudioResource<QueueEl>> {
  let track: QueueEl;
  if (typeof arg == "string") {
    let data = await (await queueModel.findById(arg))?.getFirst();
    if (data?.success) {
      track = data.next as QueueEl;
    } else {
      throw new Error("No track found");
    }
  } else {
    track = arg;
  }

  return createAudioResource<QueueEl>(
    musicStream.getStream(track?.platform as platform, track?.link as string),
    {
      metadata: {
        originalName: track?.originalName,
        link: track?.link,
        platform: track?.platform,
      },
    }
  );
}
