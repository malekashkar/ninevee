import {
  EmbedField,
  Message,
  MessageReaction,
  TextChannel,
  User,
} from "discord.js";
import UtilityGroup from ".";
import { question } from "../../util";
import embeds from "../../util/embeds";

export default class EmbedCommand extends UtilityGroup {
  name = "embed";
  description = "Create a message embed.";

  async run(message: Message) {
    const channel = await getChannel(
      message,
      `Please tag the channel you would like to post the embed in.`
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

    const color = await colorQuestion(message);
    const embed = embeds.empty().setColor(color);

    if (title) embed.setTitle(title.content);
    if (description) embed.setDescription(description.content);
    if (image) embed.setImage(image.content);
    if (thumbnail) embed.setThumbnail(thumbnail.content);
    if (fields.length) embed.addFields(fields);
    return await channel.send(embed);
  }
}

async function colorQuestion(message: Message) {
  const questionMessage = await message.channel.send(
    embeds.question(`Would you like the color black or transparent?`)
  );
  await questionMessage.react("⬛");
  await questionMessage.react("⬜");
  const collect = await questionMessage.awaitReactions(
    (r: MessageReaction, u: User) =>
      u.id === message.author.id && ["⬛", "⬜"].includes(r.emoji.name),
    { max: 1, time: 15 * 60 * 1000, errors: ["time"] }
  );
  if (questionMessage.deletable) await questionMessage.delete();
  return collect?.first()
    ? collect?.first().emoji.name === "⬛"
      ? "#000000"
      : "#2C2F33"
    : "#2C2F33";
}

async function getChannel(message: Message, question: string) {
  const questionMessage = await message.channel.send(embeds.question(question));
  const collect = await message.channel.awaitMessages(
    (x: Message) =>
      x.author.id === message.author.id && x.mentions.channels.size > 0,
    { max: 1, time: 15 * 60 * 1000, errors: ["time"] }
  );
  if (questionMessage.deletable) await questionMessage.delete();
  return collect?.first().mentions.channels.first() || null;
}
