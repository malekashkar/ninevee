import { MessageReaction, User } from "discord.js";
import config from "../config";
import { GuildModel } from "../models/guild";
import Event from ".";

export default class reactionRolesAdd extends Event {
  name = "messageReactionAdd";

  async handle(reaction: MessageReaction, user: User) {
    if (reaction.message.partial) await reaction.message.fetch();
    if (user.bot) return;

    const message = reaction.message;
    const guildData = await GuildModel.findOne({ guildId: message.guild.id });

    if (message.id !== guildData.messages.reactionRoles) return;

    const member = message.guild.members.resolve(user.id);
    const role = message.guild.roles.resolve(
      config.reactionRoles[config.emojis.indexOf(reaction.emoji.name)]
    );

    if (!role || !member || member.roles.cache.has(role.id)) return;
    else member.roles.add(role);
  }
}
