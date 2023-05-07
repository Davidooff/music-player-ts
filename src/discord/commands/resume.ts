import { SlashCommandBuilder } from "discord.js";
import ApplicationCommand from "../templates/ApplicationCommand.js";
import { getVoiceConnection } from "@discordjs/voice";

export default new ApplicationCommand({
  data: new SlashCommandBuilder().setName("resume").setDescription("!"),
  async execute(interaction): Promise<void> {
    if (interaction.guildId) {
      let getConnection = getVoiceConnection(interaction.guildId);
      if (getConnection?.state.status == "ready") {
        global.client.players.get(interaction.guildId)?.unpause();
        global.io.emit(interaction.guildId, "resume");
        await interaction.reply("resume!");
      } else interaction.reply("Problem with connection to youre voice ");
    }
  },
});
