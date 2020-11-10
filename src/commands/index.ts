import Client from "..";
import { Message } from "discord.js";
import DbUser from "../models/user";
import DbGuild from "../models/guild";
import { DocumentType } from "@typegoose/typegoose";

export default abstract class Command {
  client: Client;
  permission: string;
  disabled = false;
  category: string;
  usage = "";

  constructor(client: Client) {
    this.client = client;
  }

  abstract name: string;
  abstract description: string;
  abstract async run(
    _message: Message,
    _args: string[],
    _userData?: DocumentType<DbUser>,
    _guildData?: DocumentType<DbGuild>
  ): Promise<Message | void>;
}
