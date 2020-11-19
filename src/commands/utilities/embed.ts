import { EmbedField, Message } from "discord.js";
import UtilityGroup from ".";
import embeds from "../../util/embeds";

export default class EmbedCommand extends UtilityGroup {
  name = "embed";
  description = "Create a message embed.";

  async run(message: Message) {
    const title = await question(
      message,
      `What would you like the embed title to say?\nReply with "no" if you would like to skip this.`
    );
    const description = await question(
      message,
      `What would you like the embed description to say?\nReply with "no" if you would like to skip this.`
    );
    const image = await question(
      message,
      `Please provide a link to the image you would like to use.\nReply with "no" if you would like to skip this.`
    );
    const thumbnail = await question(
      message,
      `Please provide a link to the thumbnail you would like to use.\nReply with "no" if you would like to skip this.`
    );
    const fieldsQuestion = await question(
      message,
      `How many fields would you like?\nReply with "no" if you would like to skip this.`
    );
    const fieldsAmount =
      fieldsQuestion && !isNaN(parseInt(fieldsQuestion))
        ? parseInt(fieldsQuestion)
        : 0;
    const fields: EmbedField[] = [];

    for (let i = 0; i < fieldsAmount; i++) {
      const fieldTitle = await question(
        message,
        `What would you like **field ${i + 1}** title to be?`
      );
      const fieldDescription = await question(
        message,
        `What would you like **field ${i + 1}** description to be?`
      );

      if (fieldTitle && fieldDescription) {
        fields.push({
          name: fieldTitle,
          value: fieldDescription,
          inline: true,
        });
      }
    }

    const embed = embeds.empty();
    if (title) embed.setTitle(title);
    if (description) embed.setDescription(description);
    if (image) embed.setImage(image);
    if (thumbnail) embed.setThumbnail(thumbnail);
    if (fields.length) embed.addFields(fields);
    return await message.channel.send(embed);
  }
}

async function question(message: Message, question: string) {
  const questionMessage = await message.channel.send(embeds.question(question));
  const collect = await message.channel.awaitMessages(
    (x) => x.author.id === message.author.id,
    { max: 1, time: 15 * 60 * 1000, errors: ["time"] }
  );
  if (questionMessage.deletable) await questionMessage.delete();
  return collect?.first() && collect?.first().content !== "no"
    ? collect?.first().content
    : null;
}
