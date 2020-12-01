import { Message } from "discord.js";
import EmojiLockerGroup from ".";
import { EmojiModel } from "../../models/emojis";
import embeds from "../../util/embeds";

export default class UnlockEmojiCommand extends EmojiLockerGroup {
  name = "unlock";
  description = "Unlock one of the locked emojis.";
  usage = "<emoji> <@role>";

  async run(message: Message, args: string[]) {
    const emojiInfo = args[0]
      ? args[0].match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/)
      : false;
    if (!emojiInfo)
      return message.channel.send(
        embeds.error(`Please provide an emoji as the first argument!`)
      );

    const role = message.mentions.roles.first();
    if (!role)
      return message.channel.send(
        embeds.error(`Please tag a role as the second argument!`)
      );

    const emojiData = await EmojiModel.findOne({
      emojiId: emojiInfo[3],
    });
    if (!emojiData)
      return message.channel.send(
        embeds.error(
          `The role ${role} isn't locked to the emoji ${emojiInfo[0]}.`,
          `Emoji Locker Error`
        )
      );

    emojiData.lockedRoles = emojiData.lockedRoles.filter(
      (x: string) => x !== role.id
    );
    await emojiData.save();

    return message.channel.send(
      embeds.normal(
        `The emoji ${emojiInfo[0]} has been unlocked for role ${role}.`,
        `Emoji Locker`
      )
    );
  }
}
