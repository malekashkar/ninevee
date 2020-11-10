import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import Command from "..";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import embeds from "../../util/embeds";

export default class SyncRoleCommand extends Command {
  name: "syncrole";
  description = "Sync one role with the other.";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const firstRole = message.mentions.roles.array()[0];
    const secondRole = message.mentions.roles.array()[1];
    if (!firstRole || !secondRole)
      return message.channel.send(
        embeds.error(`Please tag both roles you want synced to each other!`)
      );

    for (const syncedrole of guildData.syncedroles) {
      if (
        syncedrole.includes(firstRole.id) &&
        syncedrole.includes(secondRole.id)
      )
        return message.channel.send(
          embeds.error(
            `Roles ${firstRole} and ${secondRole} are already synced to each other!`
          )
        );
    }

    guildData.syncedroles.push(`${firstRole.id}:${secondRole.id}`);
    await guildData.save();

    message.channel.send(
      embeds.normal(
        `The roles ${firstRole} and ${secondRole} are now synced!`,
        `Synced Roles`
      )
    );
  }
}
