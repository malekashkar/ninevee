import { DocumentType } from "@typegoose/typegoose";
import { Message, MessageEmbed } from "discord.js";
import Command from "..";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";

export default class EmbedCommand extends Command {
  name = "embed";
  description = "Create a message embed.";

  async run(
    message: Message,
    args: string[],
    userData?: DocumentType<DbUser>,
    guildData?: DocumentType<DbGuild>,
  ) {
    message.channel.send(
      new MessageEmbed().setDescription(args.join(" ")).setColor("#2C2F33")
    );
  }
}
