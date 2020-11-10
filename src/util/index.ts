import { DMChannel, Message, TextChannel } from "discord.js";

export async function react(message: Message, reactions: string[]) {
  for (const reaction of reactions) {
    try {
      await message.react(reaction);
    } catch (ignore) {}
  }
}

export async function question(
  message: Message,
  channel: DMChannel | TextChannel,
  question: string
) {
  const questionMessage = await channel.send(question);

  const response = await channel.awaitMessages(
    (x) => x.author.id === message.author.id,
    { max: 1, time: 900000, errors: ["time"] }
  );
  if (!response) return;
  if (questionMessage.deletable) questionMessage.delete();
  if (response.first().deletable) response.first().delete();

  return response.first();
}
