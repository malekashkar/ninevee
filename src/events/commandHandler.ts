import { Message } from "discord.js";
import { GuildModel } from "../models/guild";
import { UserModel } from "../models/user";
import embeds from "../util/embeds";
import { ICategories, prefixes } from "../config";
import Logger from "../util/logger";
import Event from ".";

export default class MessageHandler extends Event {
  name = "message";

  async handle(message: Message) {
    try {
      if (!message.guild || !message.author || message.author.bot) return;

      const guildData =
        (await GuildModel.findOne({ guildIdl: message.guild.id })) ||
        (await GuildModel.create({
          guildId: message.guild.id,
        }));

      const userData =
        (await UserModel.findOne({ userId: message.author.id })) ||
        (await UserModel.create({
          userId: message.author.id,
        }));

      const prefixRegex = new RegExp(
        `^${Object.values(prefixes)
          .map((x: string) => x.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
          .join("|")}`
      );
      const prefixMatch = message.content.match(prefixRegex);

      const prefix = prefixMatch ? prefixMatch[0] : null;
      if (!prefix || message.content.indexOf(prefix) !== 0) return;
      if (message.deletable) await message.delete();

      const args = message.content
        .slice(prefix.length)
        .trim()
        .replace(/ /g, "\n")
        .split(/\n+/g);
      const command = args.shift().toLowerCase();
      type categories = keyof ICategories;

      const commandObj = this.client.commands.find((x) => x.name === command);
      if (!commandObj) {
        message.channel.send(
          embeds.error(
            `The command \`${command}\` does not exist!`,
            `Invalid Command`
          )
        );
        return;
      } else if (prefixes[commandObj.category as categories] !== prefix) {
        message.channel.send(
          embeds.error(
            `Please use the prefix \`${
              prefixes[commandObj.category as categories]
            }\` with the command \`${command}\`!`,
            "Invalid Prefix"
          )
        );
        return;
      }

      try {
        for (const commandObj of this.client.commands.array()) {
          if (commandObj.disabled) continue;
          if (commandObj.name.toLowerCase() === command)
            commandObj.run(message, args, userData, guildData);
        }
      } catch (err) {
        Logger.error("COMMAND_HANDLER", err);
      }
    } catch (err) {
      Logger.error("COMMAND_HANDLER", err);
    }
  }
}
