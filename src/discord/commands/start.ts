import { GuildMember, SlashCommandBuilder } from "discord.js";
import { createAudioPlayer, joinVoiceChannel } from "@discordjs/voice";
import ApplicationCommand from "../templates/ApplicationCommand.js";
import { queue, QueueEl } from "../../mongoose/models/queue";
import createAudio from "./src/createAudio.js";
import ended from "../events/player/ended.js";

export default new ApplicationCommand({
  data: new SlashCommandBuilder()
    .setName("start")
    .setDescription("Invite bot to your voice channel"),
  async execute(interaction): Promise<void> {
    if (interaction.guildId && interaction.member && interaction.member.user) {
      const guild = client.guilds.cache.get(interaction.guildId);
      const member = guild?.members.cache.get(interaction.member.user.id);
      const voiceChannel = member?.voice.channel;
      if (!voiceChannel) {
        await interaction.reply("You need to be in a voice channel");
      } else {
        const connection = joinVoiceChannel({
          channelId: voiceChannel.id,
          guildId: interaction.guildId,
          adapterCreator: voiceChannel.guild.voiceAdapterCreator,
        });
        const audio = await createAudio(interaction.guildId);
        if (audio) {
          const player = createAudioPlayer();
          connection.subscribe(player);
          player.play(audio);
          await interaction.reply("Playing + " + audio.metadata.originalName);

          player.addListener("stateChange", (oldOne, newOne) => {
            if (newOne.status == "idle") {
              console.log("ended");
              ended(interaction.guildId as string, player);
            }
          });
        } else {
          await interaction.reply("Queue is empty");
        }
      }
    }
  },
});
