import { getVoiceConnection, createAudioPlayer } from "@discordjs/voice";
import createAudio from "./createAudio";
import ended from "../../events/player/ended";

export default async function (id: string) {
  let player = global.client.players.get(id);
  if (player) {
    player.unpause();
    io.emit(id, "unpause");
    return true;
  } else return false;
}
