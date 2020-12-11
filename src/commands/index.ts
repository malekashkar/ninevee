import Client from "..";
import { Message } from "discord.js";
import DbUser from "../models/user";
import DbGuild from "../models/guild";
import { DocumentType } from "@typegoose/typegoose";

export type CategoryNames = "Utility" | "Intro" | "EmojiLocker";

export default abstract class Command {
  permission: string;
  disabled = false;
  usage = "";

  client: Client;
  constructor(client: Client) {
    this.client = client;
  }

  abstract name: string;
  abstract description: string;
  abstract category: CategoryNames;
  abstract run(
    _message: Message,
    _args: string[],
    _userData?: DocumentType<DbUser>,
    _guildData?: DocumentType<DbGuild>
  ): Promise<Message | void>;
}
