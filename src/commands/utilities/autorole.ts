import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import Command from "..";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import embeds from "../../util/embeds";

export default class AutoRoleCommand extends Command {
  name = "autorole";
  description = "Add or remove to the autorole.";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const type = args[0]
      ? args[0].match(/add|remove|list/gm)
        ? args[0].match(/add|remove|list/gm)[0]
        : false
      : false;
    if (!type)
      return message.channel.send(
        embeds.error(`There was no type of autorole chosen as an argument!`)
      );

    const role = message.mentions.roles.first();
    if (!role && type !== "list")
      return message.channel.send(
        embeds.error(`Please tag a role as the second argument!`)
      );

    if (type === "add" && guildData.autoRoles.includes(role.id))
      return message.channel.send(
        embeds.error(`The role ${role} is already in the autorole!`)
      );
    else if (type === "remove" && !guildData.autoRoles.includes(role.id))
      return message.channel.send(
        embeds.error(`The role ${role} is already not in the autorole!`)
      );
    else if (type === "list")
      return message.channel.send(
        embeds.normal(
          guildData.autoRoles.length
            ? guildData.autoRoles
                .map((x: string, i: number) => `${i + 1}. <@&${x}>`)
                .join("\n")
            : `There are no roles set to autorole.`,
          `Autorole List`
        )
      );

    if (type === "add") guildData.autoRoles.push(role.id);
    else if (type === "remove")
      guildData.autoRoles = guildData.autoRoles.filter(
        (x: string) => x !== role.id
      );

    await guildData.save();
    message.channel.send(
      embeds.normal(
        `The role ${role} has been ${
          type === "add" ? `added to` : `removed from`
        } the autorole list.`,
        `Autorole ${type === "add" ? `Added` : `Removed`}`
      )
    );
  }
}
