import { REST } from "@discordjs/rest";
import { RESTPostAPIApplicationCommandsJSONBody, Routes } from "discord.js";
import { readdirSync } from "fs";
import type ApplicationCommand from "./templates/ApplicationCommand";
import env from "../env";

export default async function deployGlobalCommands() {
  const commands: RESTPostAPIApplicationCommandsJSONBody[] = [];
  const commandFiles: string[] = readdirSync(__dirname + "/commands").filter(
    (file) => file.endsWith(".js") || file.endsWith(".ts")
  );

  for (const file of commandFiles) {
    console.log(file);

    const command: ApplicationCommand = (await import(`./commands/${file}`))
      .default as ApplicationCommand;
    const commandData = command.data.toJSON();
    commands.push(commandData);
  }

  const rest = new REST().setToken(env.TOKEN as string);

  try {
    console.log("Started refreshing application (/) commands.");

    await rest.put(Routes.applicationCommands(env.CLIENT_ID as string), {
      body: commands,
    });

    console.log("Successfully reloaded application (/) commands.");
  } catch (error) {
    console.error(error);
  }
}
