import { Message } from "discord.js";
import EmojiLockerGroup from ".";
import { EmojiModel } from "../../models/emojis";
import confirmation from "../../util/confirmation";
import embeds from "../../util/embeds";

export default class unlockAddEmojis extends EmojiLockerGroup {
  name = "unlockall";
  description = "Unlock all of the locked emojis.";
  usage = "<emoji>";

  async run(message: Message, args: string[]) {
    const emojiInfo = args[0]
      ? args[0].match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/)
      : false;
    if (!emojiInfo)
      return message.channel.send(
        embeds.error(`Please provide an emoji as the first argument!`)
      );

    const emojiData = await EmojiModel.findOne({
      emojiId: emojiInfo[3],
    });
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
    await emojiData.save();

    return message.channel.send(
      embeds.normal(
        `The emoji ${emojiInfo[0]} has been completely unlocked from all roles.`,
        `Emoji Locker`
      )
    );
  }
}
