import { Message } from "discord.js";
import EmojiLockerGroup from ".";
import { EmojiModel } from "../../models/emojis";
import embeds from "../../util/embeds";

export default class emojiInfoCommand extends EmojiLockerGroup {
  name = "emojiinfo";
  description = "Receive information from an emoji.";

  async run(message: Message) {
    const emojisInformation = await EmojiModel.find({});

    if (emojisInformation.length) {
      for (const emojiInformation of emojisInformation) {
        const emoji = this.client.emojis.resolve(emojiInformation.emojiId);
        if (!emoji) await emojiInformation.deleteOne();

        for (const roleId of emojiInformation.lockedRoles) {
          const role = message.guild.roles.resolve(roleId);
          if (!role)
            emojiInformation.lockedRoles = emojiInformation.lockedRoles.filter(
              (x) => x !== roleId
            );
        }
        await emojiInformation.save();
      }
    }

    if (!emojisInformation.length)
      return message.channel.send(
        embeds.error(`There are no emojis with locked roles!`)
      );

    const description = emojisInformation
      .map((x) => {
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
