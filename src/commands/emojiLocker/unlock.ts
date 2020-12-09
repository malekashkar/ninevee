import { Message } from "discord.js";
import EmojiLockerGroup from ".";
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

    const roles = message.mentions.roles.array();
    if (!roles.length)
      return message.channel.send(embeds.error(`Please tag the role(s)!`));

    const emoji = emojiInfo[0];
    const emojiId = emojiInfo[3];
    const guildEmoji = message.guild.emojis.resolve(emojiId);
    if (!guildEmoji)
      return message.channel.send(
        embeds.error(`That emoji does not belong to this discord server!`)
      );

    for (const role of roles) {
      await guildEmoji.roles.remove(role);
    }

    return message.channel.send(
      embeds.normal(
        `The emoji ${
          emojiInfo[0]
        } has been unlocked from the role(s) ${roles.join(", ")}.`,
        `Emoji Locker`
      )
    );
  }
}
