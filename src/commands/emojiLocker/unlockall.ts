import { DocumentType } from "@typegoose/typegoose";
import { Message } from "discord.js";
import Command from "..";
import DbGuild, { EmojiLocker } from "../../models/guild";
import DbUser from "../../models/user";
import confirmation from "../../util/confirmation";
import embeds from "../../util/embeds";

export default class unlockAddEmojis extends Command {
  name = "unlockall";
  description = "Unlock all of the locked emojis.";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const emojiInfo = args[0]
      ? args[0].match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/)
      : false;

    if (!emojiInfo)
      return message.channel.send(
        embeds.error(`Please provide an emoji as the first argument!`)
      );

    const emojiData = guildData.emojiLocker.find(
      (x: EmojiLocker) => x.emojiId === emojiInfo[3] && x.lockedRoles.length > 0
    );

    if (!emojiData)
      return message.channel.send(
        embeds.error(
          `There are no roles locked to the emoji ${emojiInfo[0]}.`,
          `Emoji Locker Error`
        )
      );

    const confirm = await confirmation(
      `Are you sure you would like to clear all locked roles from the emoji ${emojiInfo[0]}?`,
      `Unlock All Roles`,
      message
    );

    if (!confirm) return;

    emojiData.lockedRoles = [];
    await guildData.save();

    return message.channel.send(
      embeds.normal(
        `The emoji ${emojiInfo[0]} has been completely unlocked from all roles.`,
        `Emoji Locker`
      )
    );
  }
}
