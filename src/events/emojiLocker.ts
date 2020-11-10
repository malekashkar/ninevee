import { Message } from "discord.js";
import config from "../config";
import { GuildModel, EmojiLocker } from "../models/guild";
import Event from ".";

export default class emojiLockerEvent extends Event {
  name = "message";

  async handle(message: Message) {
    if (message.content.includes(config.prefixes.emojiLocker)) return;

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

      const emojiData = guildData.emojiLocker.find(
        (x: EmojiLocker) => x.emojiId === id
      );
      if (!emojiData || !emojiData.lockedRoles.length) return;

      const lockedRoles = emojiData.lockedRoles;
      const userRoles = message.member.roles.cache.array();

      let included = false;
      for (let i = 0; i < userRoles.length; i++) {
        if (lockedRoles.includes(userRoles[i].id)) included = !included;
      }

      if (!included) return message.delete();
    });
  }
}
