import { GuildMember } from "discord.js";
import { GuildModel } from "../models/guild";
import Event from ".";

export default class autoRole extends Event {
  name = "guildMemberAdd";

  async handle(member: GuildMember) {
    if (member.user.bot) return;

    const guildData = await GuildModel.findOne({ guildId: member.guild.id });
    if (!guildData || !guildData.autoRoles.length) return;

    guildData.autoRoles.forEach(async (roleId: string) => {
      const role = member.guild.roles.resolve(roleId);
      if (!role) {
        guildData.autoRoles.filter((x: string) => x !== roleId);
        return await guildData.save();
      }

      await member.roles.add(role);
    });
  }
}
