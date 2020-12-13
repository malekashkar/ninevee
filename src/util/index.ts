import { DMChannel, Message, TextChannel, User } from "discord.js";

export async function react(message: Message, reactions: string[]) {
  for (const reaction of reactions) {
    try {
      await message.react(reaction);
    } catch (ignore) {}
  }
}

export async function question(
  user: User,
  channel: DMChannel | TextChannel,
  question: string
) {
  const questionMessage = await channel.send(
    question + `\nReply with **-** if you would like to skip this.`
  );

  const response = await channel.awaitMessages((x) => x.author.id === user.id, {
    max: 1,
    time: 900000,
    errors: ["time"],
  });
  if (response) {
    if (questionMessage.deletable) questionMessage.delete();
    if (response.first().deletable) response.first().delete();
    if (
      ["-", "no", "skip", "none"].includes(
        response.first().content.toLowerCase()
      )
    )
      return null;

    return response.first();
  } else return null;
}
