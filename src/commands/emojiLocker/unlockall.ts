import { Message } from "discord.js";
import EmojiLockerGroup from ".";
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

    const emoji = emojiInfo[0];
    const emojiId = emojiInfo[3];
    const guildEmoji = message.guild.emojis.resolve(emojiId);
    if (!guildEmoji)
      return message.channel.send(
        embeds.error(`The emoji ${emoji} does not belong to this server!`)
      );

    if (!guildEmoji.roles.cache.size)
      return message.channel.send(
        embeds.error(`The emoji ${emoji} is not locked to any roles!`)
      );

    await guildEmoji.roles.remove(guildEmoji.roles.cache);
    return message.channel.send(
      embeds.normal(
        `The emoji ${emoji} has been completely unlocked from all roles.`,
        `Emoji Locker`
      )
    );
  }
}
