import { SlashCommandBuilder } from "discord.js";
import ApplicationCommand from "../templates/ApplicationCommand.js";

export default new ApplicationCommand({
  data: new SlashCommandBuilder().setName("ping").setDescription("Real ping!"),
  async execute(interaction): Promise<void> {
    console.log(interaction);
    await interaction.reply("Pong!");
  },
});
