import { GuildMember } from "discord.js";
import { GuildModel } from "../models/guild";
import Event from ".";

export default class syncRoles extends Event {
  name = "guildMemberUpdate";

  async handle(oldMember: GuildMember, newMember: GuildMember) {
    const guildData = await GuildModel.findOne({ guildId: newMember.guild.id });
    if (!guildData) return;

    const oldRolesId = oldMember.roles.cache.array().map((x) => x.id);
    const newRoles = newMember.roles.cache.array();
    if (oldRolesId.length >= newRoles.length) return;

    const roleAdded = newRoles
      .map((role) => {
        if (!oldRolesId.includes(role.id)) return role.id;
      })
      .filter((x) => !!x)[0];

    for (const syncedRole of guildData.syncedroles) {
      if (!syncedRole.includes(roleAdded)) continue;

      const otherRole =
        syncedRole.split(":")[0] === roleAdded
          ? syncedRole.split(":")[1]
          : syncedRole.split(":")[0];

      if (!newMember.roles.cache.has(otherRole)) newMember.roles.add(otherRole);
    }
  }
}
