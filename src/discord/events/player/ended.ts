import { getVoiceConnection, createAudioPlayer } from "@discordjs/voice";
import { queueModel, QueueEl } from "../../../mongoose/models/queue";
import createAudio from "../../commands/src/createAudio";
import embed from "../../commands/src/embed";

export default async function ended(
  this: void,
  id: string,
  player: any
): Promise<void> {
  const connection = getVoiceConnection(id);
  if (connection) {
    let queueData = await queueModel.findById(id).then(async (data) => {
      data?.queue.shift();
      await data?.save();
      return data;
    });
    const audio = await createAudio(id);
    if (audio) {
      player.play(audio);
      await embed(audio.metadata, id, queueData?.msgId, queueData?.channelId);
      io.emit(id, "skip");
    }
  }
}
