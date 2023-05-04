import { AudioResource, createAudioResource } from "@discordjs/voice";
import { queue, QueueEl } from "../../../mongoose/models/queue";
import musicStream from "../../../music-streaming/main";
import { platform } from "../../../../config/types";

export default async function createAudio(
  id: string
): Promise<AudioResource<QueueEl> | null> {
  let courentQueue = await queue.findById(id).then(async (data) => {
    if (!data) {
      await queue.create({ _id: id });
      return null;
    } else {
      return (await data.getQueue(0, 1))[0];
    }
  });
  if (courentQueue) {
    return createAudioResource(
      musicStream.getStream(
        courentQueue?.platform as platform,
        courentQueue?.link as string
      ),
      {
        metadata: {
          originalName: courentQueue?.originalName,
          link: courentQueue?.link,
          platform: courentQueue?.platform as string,
        },
      }
    );
  } else {
    return null;
  }
}
