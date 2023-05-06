import {
  joinVoiceChannel,
  getVoiceConnection,
  createAudioPlayer,
} from "@discordjs/voice";
import { VoiceBasedChannel } from "discord.js";
import { queueModel, QueueEl } from "../../../mongoose/models/queue";
import user from "../../../mongoose/models/user";
import createAudio from "./createAudio";
import ended from "../../events/player/ended";

interface JoinVoiceReturn {
  success: boolean;
  msg?: string;
  track?: QueueEl;
}

export default async function (
  channelId: string,
  guildId: string,
  voiceChannel: VoiceBasedChannel,
  userId?: string
): Promise<JoinVoiceReturn> {
  let getConnection = getVoiceConnection(guildId);
  if (getConnection?.state.status == "ready")
    return { success: false, msg: "Already connected" };

  const connection = joinVoiceChannel({
    channelId: channelId,
    guildId: guildId,
    adapterCreator: voiceChannel.guild.voiceAdapterCreator,
  });
  const queue = await queueModel.findById(guildId).lean();
  let haveTrackInQueu = true;
  if (queue && queue.queue && queue.queue.toString() == "") {
    haveTrackInQueu = false;
  } else if (!queue) {
    await queueModel.create({ _id: guildId });
    haveTrackInQueu = false;
  }
  console.log(haveTrackInQueu);

  if (userId) {
    let add = user.findById(userId).lean();
    let moveTo = queueModel.findById(guildId).exec();
    let success = await Promise.all([add, moveTo]).then(async (data) => {
      if (!data[0] || !data[1]) return false;
      else {
        data[1].queue.push(...data[0].library);
        await data[1].save();
        return true;
      }
    });
    if (!success) return { success: false, msg: "Failed to add library" };
  }
  if (haveTrackInQueu) {
    let audio = await createAudio(guildId);
    if (audio) {
      let player = createAudioPlayer();
      connection.subscribe(player);
      player.play(audio);
      player.addListener("stateChange", (oldOne, newOne) => {
        if (newOne.status == "idle") {
          ended(guildId, player);
        }
      });
      return { success: true, track: audio.metadata };
    } else return { success: false, msg: "Error creating player" };
  } else return { success: true };
}
