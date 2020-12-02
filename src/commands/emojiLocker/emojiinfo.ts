import { Message } from "discord.js";
import EmojiLockerGroup from ".";
import { EmojiModel } from "../../models/emojis";
import embeds from "../../util/embeds";
import Paginator from "../../util/pagecord";

export default class emojiInfoCommand extends EmojiLockerGroup {
  name = "emojiinfo";
  description = "Receive information from an emoji.";

  async run(message: Message) {
    const emojisCount = await EmojiModel.countDocuments();
    if (!emojisCount)
      return message.channel.send(
        embeds.error(`There are no emojis with locked roles!`)
      );

    const paginator = new Paginator(
      message,
      Math.ceil(emojisCount / 5),
      async (pageIndex) => {
        let documents = await EmojiModel.find()
          .skip(pageIndex * 5)
          .limit(5);

        const description = documents
          .map((x) => {
            if (
              !message.member.hasPermission("ADMINISTRATOR") &&
              !x.lockedRoles.some((roleId) =>
                message.member.roles.cache.has(roleId)
              )
            )
              return;

            const emoji = this.client.emojis.resolve(x.emojiId);
            const roles = x.lockedRoles
              .map((roleId) => `<@&${roleId}>`)
              .join(` `);
            return `${emoji} ~ ${roles}`;
          })
          .filter((x) => !!x)
          .join("\n");

        return embeds.normal(
          description,
          `Emoji Information | ${pageIndex + 1}`
        );
      }
    );
    await paginator.start();
  }
}
