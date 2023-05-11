import { getVoiceConnection, createAudioPlayer } from "@discordjs/voice";
import createAudio from "./createAudio";
import { queueModel } from "../../../mongoose/models/queue";
import ended from "../../events/player/ended";
import embed from "./embed";

export default async function (id: string): Promise<boolean> {
  const connection = getVoiceConnection(id);
  if (connection) {
    let queueData = await queueModel.findById(id).then(async (data) => {
      data?.queue.shift();
      await data?.save();
      return data;
    });

    const audio = await createAudio(id);
    if (audio) {
      const player = createAudioPlayer();
      connection.subscribe(player);
      player.play(audio);
      await embed(audio.metadata, id, queueData?.msgId, queueData?.channelId);
      player.addListener("stateChange", (oldOne, newOne) => {
        if (newOne.status == "idle") {
          ended(id, player);
        }
      });
      io.emit(id, "skip");
      return true;
    } else {
      return false;
    }
  } else return false;
}
