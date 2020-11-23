import { MessageReaction, User } from "discord.js";
import { emojis, reactionRoles } from "../config";
import { GuildModel } from "../models/guild";
import Event from ".";

export default class reactionRolesRemove extends Event {
  name = "messageReactionRemove";

  async handle(reaction: MessageReaction, user: User) {
    if (reaction.message.partial) await reaction.message.fetch();
    if (user.bot) return;

    const message = reaction.message;
    const guildData = await GuildModel.findOne({ guildId: message.guild.id });

    if (message.id !== guildData.messages.reactionRoles) return;

    const member = message.guild.members.resolve(user.id);
    const role = message.guild.roles.resolve(
      reactionRoles[emojis.indexOf(reaction.emoji.name)]
    );

    if (!role || !member || !member.roles.cache.has(role.id)) return;
    else member.roles.remove(role);
  }
}
