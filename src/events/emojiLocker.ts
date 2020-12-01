import { Message } from "discord.js";
import { prefixes } from "../config";
import { GuildModel } from "../models/guild";
import Event from ".";
import { EmojiModel } from "../models/emojis";

export default class emojiLockerEvent extends Event {
  name = "message";

  async handle(message: Message) {
    if (message.content.includes(prefixes.EmojiLocker)) return;

    const emojiInfo = message.content
      ? message.content.match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/gm)
      : false;

    const emojiIds = emojiInfo
      ? emojiInfo.map((x) => x.split(":")[2].replace(">", ""))
      : false;

    if (!emojiInfo || !emojiIds) return;

    emojiIds.forEach(async (id) => {
      const guildData = await GuildModel.findOne({ guildId: message.guild.id });
      if (!guildData) return;

      const emojiData = await EmojiModel.findOne({
        emojiId: id,
      });
      if (!emojiData?.lockedRoles.length) return;

      const includes = emojiData.lockedRoles.some((roleId) =>
        message.member.roles.cache.array().some((role) => role.id === roleId)
      );
      if (!includes) return message.delete();
    });
  }
}
