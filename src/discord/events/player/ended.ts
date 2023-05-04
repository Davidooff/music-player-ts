import { getVoiceConnection, createAudioPlayer } from "@discordjs/voice";
import { queue, QueueEl } from "../../../mongoose/models/queue";
import createAudio from "../../commands/src/createAudio";

export default async function ended(
  this: void,
  id: string,
  player: any
): Promise<void> {
  const connection = getVoiceConnection(id);
  if (connection) {
    await queue.findById(id).then(async (data) => {
      data?.queue.shift();
      await data?.save();
    });
    const audio = await createAudio(id);
    if (audio) {
      player.play(audio);
      io.emit(id, "skip");
    }
  }
}
