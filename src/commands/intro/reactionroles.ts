import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import Command from "..";
import config from "../../config";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import embeds from "../../util/embeds";

export default class ReactionRolesCommand extends Command {
  name = "reactionroles";
  description = "";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const msg = await message.channel.send(
      embeds.normal(
        config.reactionRoles
          .map((x, i) => {
            const role = message.guild.roles.resolve(x);
            if (role) return `${config.emojis[i]} ${role}`;
          })
          .filter((x) => !!x)
          .join("\n"),
        `Reaction Roles`
      )
    );

    config.reactionRoles.forEach((x, i) => msg.react(config.emojis[i]));

    guildData.messages.reactionRoles = msg.id;
    await guildData.save();
  }
}
