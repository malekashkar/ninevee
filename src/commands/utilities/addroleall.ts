import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import UtilityGroup from ".";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import embeds from "../../util/embeds";

export default class AddRoleAddCommand extends UtilityGroup {
  name = "addroleall";
  description = "Add a role to all the users in your server.";

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

    const guildMembers = message.guild.members.cache
      .array()
      .filter((x) => !x.user.bot && x.roles.cache.has(role.id));

    const addingRoles = setInterval(addRole, 3000);

    function addRole() {
      if (!guildMembers.length) {
        clearInterval(addingRoles);
        message.channel.send(
          embeds.normal(`Everyone now has the ${role} role.`, `Role Add All`)
        );
        return;
      }

      const guildMember = message.guild.members.cache.get(guildMembers[0].id);
      guildMember.roles.add(role);
      guildMembers.shift();
    }
  }
}
