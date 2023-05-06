import { GuildMember, SlashCommandBuilder } from "discord.js";
import { createAudioPlayer, joinVoiceChannel } from "@discordjs/voice";
import ApplicationCommand from "../templates/ApplicationCommand.js";
import { queueModel, QueueEl } from "../../mongoose/models/queue";
import createAudio from "./src/createAudio.js";
import ended from "../events/player/ended.js";
import joinVoice from "./src/joinVoice.js";
import embed from "./src/embed.js";

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
        return;
      }

      let voiceData = await joinVoice(
        voiceChannel.id,
        interaction.guildId,
        voiceChannel
      ).catch((e) => {
        interaction.reply("Unexpected error: " + e);
      });

      if (voiceData && voiceData.success) {
        await interaction.reply("Joined");
        const message = await interaction.fetchReply(); //getting reply message
        let msgID = message.id;
        if (msgID) {
          //saving message id and channel id to database
          await queueModel.findById(interaction.guildId).then(async (data) => {
            if (data) {
              data.msgId = msgID;
              data.channelId = interaction.channelId;
              await data.save();
            } else {
              await interaction.reply("Error by creating message");
            }
          });
        } // if joinVoice return track from queue then send embed
        if (voiceData.track) {
          console.log("channelId: " + interaction.channelId);
          console.log("msgID: " + msgID);

          await embed(
            voiceData.track as QueueEl,
            interaction.guildId,
            msgID,
            interaction.channelId
          );
        }
      } else if (voiceData && voiceData.success == false && voiceData.msg) {
        await interaction.reply(voiceData.msg);
      }
    }
  },
});
