import discord from "discord.js";
import { QueueEl } from "../../../mongoose/models/queue";

const { EmbedBuilder } = require("discord.js");

// inside a command, event listener, etc.
export default async function (
  options: QueueEl,
  guildId: string,
  msgId?: string,
  channelId?: string
) {
  const exampleEmbed = new EmbedBuilder()
    .setColor(0x0099ff)
    .setTitle(options.originalName)
    .setURL("https://discord.js.org/" + guildId)
    .setDescription(options.platform + ": " + options.link)
    // .setThumbnail("https://i.imgur.com/AfFp7pu.png")
    .setImage("https://i.imgur.com/AfFp7pu.png")
    .setTimestamp()
    .setFooter({
      text: "Some footer text here",
      iconURL: "https://i.imgur.com/AfFp7pu.png",
    });
  if (msgId && channelId) {
    let channel = await client.channels.fetch(channelId);
    if (channel instanceof discord.TextChannel) {
      const messages = await channel.messages.fetch(msgId);
      if (messages instanceof discord.Message) {
        await messages.edit({ embeds: [exampleEmbed] });
      }
    }
  }
}
