import { Message } from "discord.js";
import EmojiLockerGroup from ".";
import embeds from "../../util/embeds";
import { stripIndents } from "common-tags";
import moment from "moment";

export default class emojiInfoCommand extends EmojiLockerGroup {
  name = "emojiinfo";
  description = "Receive information from an emoji.";

  async run(message: Message, args: string[]) {
    const guildEmojis = message.guild.emojis.cache;
    if (!guildEmojis.size)
      return message.channel.send(
        embeds.error(`This server does not have any custom emojis to display.`)
      );

    const selectedEmoji = args[0]
      ? args[0].match(/<?(a)?:?(\w{2,32}):(\d{17,19})>?/)
      : false;

    if (!selectedEmoji) {
      const staticEmoji = guildEmojis.filter((x) => !x.animated).array();
      const animatedEmojis = guildEmojis.filter((x) => x.animated).array();
      const embed = embeds
        .normal(
          `Here is a list of the emotes in **${message.guild.name}**\nFor more information, provide an emoji after the command \`emojiinfo <emoji>\``,
          `${message.guild.name} Emojis`
        )
        .addField(
          `${guildEmojis.size} Emojis`,
          stripIndents`Static: **${staticEmoji.length}**
          Animated: **${animatedEmojis.length}**`
        )
        .setThumbnail(message.guild.iconURL({ dynamic: true }));
      return message.channel.send(embed);
    } else {
      const selectedEmojiId = selectedEmoji[3];
      const guildEmoji = message.guild.emojis.resolve(selectedEmojiId);
      if (!guildEmoji)
        return message.channel.send(
          embeds.error(`That emoji does not belong to this discord server!`)
        );

      const embed = embeds
        .normal(
          `**Animated**: ${guildEmoji.animated ? "Yes" : "No"}
        **Roles**: ${
          guildEmoji.roles.cache.size
            ? guildEmoji.roles.cache.array().join(" ")
            : `@everyone`
        }
        **ID**: ${guildEmoji.id}
        **Created At**: ${moment(guildEmoji.createdTimestamp).format("LLL")}
        **Download**: [Click Here](${guildEmoji.url})`,
          `${guildEmoji.name} Emoji`
        )
        .setThumbnail(guildEmoji.url);
      return message.channel.send(embed);
    }
  }
}
