import { Client, Collection } from "discord.js";
import ApplicationCommand from "../templates/ApplicationCommand";
import MessageCommand from "../templates/MessageCommand";
import { AudioPlayer } from "@discordjs/voice";

interface DiscordClient extends Client {
  commands: Collection<string, ApplicationCommand>;
  players: Collection<string, AudioPlayer>;
}

declare global {
  var client: DiscordClient;

  type PartialBy<T, K extends keyof T> = Omit<T, K> & Partial<Pick<T, K>>;
}

export {};
