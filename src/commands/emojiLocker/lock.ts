import { Message } from "discord.js";
import EmojiLockerGroup from ".";
import { EmojiModel } from "../../models/emojis";
import embeds from "../../util/embeds";

export default class lockEmojiCommand extends EmojiLockerGroup {
  name = "lock";
  description = "Lock an emoji to a certain role.";
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

    if (emojiData && emojiData.lockedRoles.includes(role.id))
      return message.channel.send(
        embeds.error(
          `The role ${role} is already locked to the emoji ${emojiInfo[0]}.`,
          `Emoji Locker Error`
        )
      );

    if (!emojiData) {
      await EmojiModel.create({
        emojiId: emojiInfo[3],
        lockedRoles: [role.id],
      });
    } else {
      emojiData.lockedRoles.push(role.id);
      await emojiData.save();
    }

    return message.channel.send(
      embeds.normal(
        `The emoji ${emojiInfo[0]} has been locked to role ${role}.`,
        `Emoji Locker`
      )
    );
  }
}
