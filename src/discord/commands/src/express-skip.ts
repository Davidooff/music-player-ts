import { getVoiceConnection, createAudioPlayer } from "@discordjs/voice";
import createAudio from "./createAudio";
import { queue } from "../../../mongoose/models/queue";
import ended from "../../events/player/ended";

export default async function (id: string) {
  const connection = getVoiceConnection(id);
  if (connection) {
    await queue.findById(id).then(async (data) => {
      data?.queue.shift();
      await data?.save();
    });
    const player = createAudioPlayer();
    const audio = await createAudio(id);
    if (audio) {
      connection.subscribe(player);
      player.play(audio);
      player.addListener("stateChange", (oldOne, newOne) => {
        if (newOne.status == "idle") {
          console.log("ended");
          ended(id, player);
        }
      });
    }
  }
}
