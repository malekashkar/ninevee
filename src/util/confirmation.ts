import { Message } from "discord.js";
import embeds from "./embeds";
import { react } from ".";

export default async function confirmation(
  text: string,
  title: string,
  message: Message
) {
  const emojis = {
    yes: "✅",
    no: "❎",
  };

  const msg = await message.channel.send(
    embeds.normal(
      text +
        `\nYou have 30 seconds to react with the ${emojis.yes} or ${emojis.no}.`,
      title
    )
  );
  await react(msg, [emojis.yes, emojis.no]);

  const reactionResponses = await msg.awaitReactions(
    (reaction, user) =>
      user.id === message.author.id &&
      [emojis.yes, emojis.no].includes(reaction.emoji.name),
    { max: 1, time: 30000 }
  );

  if (msg.deletable) msg.delete();

  if (
    !reactionResponses.size ||
    reactionResponses.first().emoji.name !== emojis.yes
  )
    return false;
  else return true;
}
