import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import UtilityGroup from ".";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import embeds from "../../util/embeds";

export default class RemoveAllCommand extends UtilityGroup {
  name = "removeroleall";
  description = "Remove a role from all the users in the discord server.";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const role = message.mentions.roles.first();
    if (!role)
      return message.channel.send(
        embeds.error(`Please tag a role as the first argument!`)
      );

    let guildMembers = message.guild.members.cache
      .array()
      .filter((x) => !x.roles.cache.has(role.id) && !x.user.bot);

    const removeRoles = setInterval(removeRole, 3000);

    function removeRole() {
      if (!guildMembers.length) {
        clearInterval(removeRoles);
        message.channel.send(
          embeds.normal(
            `I have taken the ${role} role from everyone.`,
            `Role Remove All`
          )
        );
        return;
      }

      const guildMember = message.guild.members.cache.get(guildMembers[0].id);
      guildMember.roles.remove(role);
      guildMembers.shift();
    }
  }
}
