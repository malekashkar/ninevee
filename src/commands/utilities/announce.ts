import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import UtilityGroup from ".";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import embeds from "../../util/embeds";

export default class AnnounceCommand extends UtilityGroup {
  name = "announce";
  description = "Announce a message to the discord server.";
  usage = "<#channel> <announcement>";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const channel = message.mentions.channels.first();
    if (!channel)
      return message.channel.send(
        embeds.error(`Please tag a channel as the first argument!`)
      );

    args.shift();
    const msg = args.join(" ");
    if (!msg)
      return message.channel.send(
        embeds.error(
          `Please write a mesasge to send to the ${channel} channel!`
        )
      );

    channel.send(embeds.normal(msg, `Announcements`));
  }
}
