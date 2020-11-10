import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import EmojiLockerGroup from ".";
import DbGuild, { EmojiLocker } from "../../models/guild";
import DbUser from "../../models/user";
import embeds from "../../util/embeds";

export default class emojiInfoCommand extends EmojiLockerGroup {
  name = "emojiinfo";
  description = "Receive information from an emoji.";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    guildData.emojiLocker.forEach((emojiX: EmojiLocker) => {
      const emoji = message.guild.emojis.cache.get(emojiX.emojiId);
      if (!emoji)
        return (guildData.emojiLocker = guildData.emojiLocker.filter(
          (x: EmojiLocker) => x.emojiId !== emojiX.emojiId
        ));

      emojiX.lockedRoles.forEach((roleId: string) => {
        const roleX = message.guild.roles.cache.get(roleId);
        if (!roleX)
          return (emojiX.lockedRoles = emojiX.lockedRoles.filter(
            (x) => x !== roleId
          ));
      });
    });

    if (!guildData.emojiLocker.length)
      return message.channel.send(
        embeds.error(`There are no emojis with locked roles!`)
      );

    const description = guildData.emojiLocker
      .map((x: EmojiLocker) => {
        const emoji = message.guild.emojis.cache.get(x.emojiId);
        if (emoji)
          return `Emoji: ${emoji}\nLocked Roles: ${
            x.lockedRoles.length
              ? x.lockedRoles
                  .map((roleId: string) => `<@&${roleId}>`)
                  .join(", ")
              : `There are no locked roles available.`
          }`;
      })
      .filter((x) => !!x);

    return message.channel.send(
      embeds.normal(description.join("\n"), `Emoji Locker`)
    );
  }
}
