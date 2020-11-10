import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import Command from "..";
import DbGuild, { EmojiLocker } from "../../models/guild";
import DbUser from "../../models/user";
import embeds from "../../util/embeds";

export default class lockEmojiCommand extends Command {
  name = "lock";
  description = "Lock an emoji to a certain role.";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const emojiInfo = args[0]
      ? args[0].match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/)
      : false;
    const role = message.mentions.roles.first();

    if (!emojiInfo)
      return message.channel.send(
        embeds.error(`Please provide an emoji as the first argument!`)
      );

    if (!role)
      return message.channel.send(
        embeds.error(`Please tag a role as the second argument!`)
      );

    const emojiData = guildData.emojiLocker.find(
      (x: EmojiLocker) => x.emojiId === emojiInfo[3]
    );

    if (
      emojiData &&
      emojiData.lockedRoles &&
      emojiData.lockedRoles.includes(role.id)
    )
      return message.channel.send(
        embeds.error(
          `The role ${role} is already locked to the emoji ${emojiInfo[0]}.`,
          `Emoji Locker Error`
        )
      );

    if (!emojiData)
      guildData.emojiLocker.push({
        emojiId: emojiInfo[3],
        lockedRoles: [role.id],
      });
    else emojiData.lockedRoles.push(role.id);
    await guildData.save();

    return message.channel.send(
      embeds.normal(
        `The emoji ${emojiInfo[0]} has been locked to role ${role}.`,
        `Emoji Locker`
      )
    );
  }
}
