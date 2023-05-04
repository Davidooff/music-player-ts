import { readdirSync } from "fs";
import {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  Partials,
} from "discord.js";
import deployComands from "./deploy-commands";
import ApplicationCommand from "./templates/ApplicationCommand";
import env from "../env";
import Event from "./templates/Envent";

class DiscordBot {
  public deploy!: boolean;

  constructor(deploy: boolean = true) {
    this.deploy = deploy;
    this.init(deploy);
  }
  async init(deploy: boolean) {
    if (deploy) {
      await deployComands();
    }
    global.client = Object.assign(
      new Client({
        intents: [
          GatewayIntentBits.Guilds,
          GatewayIntentBits.GuildMessages,
          GatewayIntentBits.DirectMessages,
          GatewayIntentBits.GuildVoiceStates,
        ],
        partials: [Partials.Channel],
      }),
      {
        commands: new Collection<string, ApplicationCommand>(),
      }
    );

    // Set each command in the commands folder as a command in the client.commands collection
    const commandFiles: string[] = readdirSync(__dirname + "/commands").filter(
      (file) => file.endsWith(".js") || file.endsWith(".ts")
    );
    for (const file of commandFiles) {
      const command: ApplicationCommand = (await import(`./commands/${file}`))
        .default as ApplicationCommand;
      client.commands.set(command.data.name, command);
    }

    // Event handling
    const eventFiles: string[] = readdirSync(__dirname + "/events").filter(
      (file) => file.endsWith(".js") || file.endsWith(".ts")
    );

    for (const file of eventFiles) {
      const event: Event = (await import(`./events/${file}`)).default as Event;
      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
      } else {
        client.on(event.name, (...args) => event.execute(...args));
      }
    }

    await client.login(env.TOKEN);
  }
}

export default new DiscordBot(env.DEPLOY);
