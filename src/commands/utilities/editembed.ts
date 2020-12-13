import { EmbedField, Message, TextChannel } from "discord.js";
import UtilityGroup from ".";
import { question } from "../../util";
import embeds from "../../util/embeds";

export default class EmbedCommand extends UtilityGroup {
  name = "editembed";
  description = "Edit an embed that was made in the past.";
  usage = "<message id>";

  async run(message: Message, args: string[]) {
    const fetchedMessage = args[0]
      ? await message.channel.messages.fetch(args[0])
      : null;
    if (!fetchedMessage)
      return message.channel.send(
        embeds.error(
          `Please provide a valid id of the message you would like to edit in this channel.`
        )
      );

    const title = await question(
      message.author,
      message.channel as TextChannel,
      `What would you like the embed title to say?`
    );
    const description = await question(
      message.author,
      message.channel as TextChannel,
      `What would you like the embed description to say?`
    );
    const image = await question(
      message.author,
      message.channel as TextChannel,
      `Please provide a link to the image you would like to use.`
    );
    const thumbnail = await question(
      message.author,
      message.channel as TextChannel,
      `Please provide a link to the thumbnail you would like to use.`
    );
    const fieldsQuestion = await question(
      message.author,
      message.channel as TextChannel,
      `How many fields would you like?`
    );
    const fieldsAmount =
      fieldsQuestion && !isNaN(parseInt(fieldsQuestion.content))
        ? parseInt(fieldsQuestion.content)
        : 0;
    const fields: EmbedField[] = [];

    for (let i = 0; i < fieldsAmount; i++) {
      const fieldTitle = await question(
        message.author,
        message.channel as TextChannel,
        `What would you like **field ${i + 1}** title to be?`
      );
      const fieldDescription = await question(
        message.author,
        message.channel as TextChannel,
        `What would you like **field ${i + 1}** description to be?`
      );

      if (fieldTitle && fieldDescription) {
        fields.push({
          name: fieldTitle.content,
          value: fieldDescription.content,
          inline: true,
        });
      }
    }

    const embed = embeds.empty();
    if (title) embed.setTitle(title.content);
    if (description) embed.setDescription(description.content);
    if (image) embed.setImage(image.content);
    if (thumbnail) embed.setThumbnail(thumbnail.content);
    if (fields.length) embed.addFields(fields);
    return await fetchedMessage.edit(embed);
  }
}
