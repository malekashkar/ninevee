import { Message, TextChannel } from "discord.js";
import { Intro } from "../models/user";
import embeds from "./embeds";

export async function editMessage(message: Message, values: Intro) {
  const embed = embeds
    .empty()
    .setTitle(`${values.name}'s Intro`)
    .setThumbnail(values.icon)
    .addField(`Name`, values.name, true)
    .addField(`Age`, values.age, true)
    .addField(`Location`, values.location, true)
    .addField(`Language`, values.language, true)
    .addField(`Hobbies`, values.hobbies, true)
    .addField(`Favorite Game`, values.game, true)
    .addField(`Favorite Movie`, values.movie, true)
    .addField(`Pet`, values.pet, true)
    .addField(`About Me`, values.extra, true);

  if (message.deleted) {
    return await message.channel.send(embed);
  } else {
    return await message.edit(embed);
  }
}

export async function startMessage(channel: TextChannel, values: Intro) {
  const embed = embeds
    .empty()
    .setTitle(`${values.name}'s Intro`)
    .setThumbnail(values.icon)
    .addField(`Name`, values.name, true)
    .addField(`Age`, values.age, true)
    .addField(`Location`, values.location, true)
    .addField(`Language`, values.language, true)
    .addField(`Hobbies`, values.hobbies, true)
    .addField(`Favorite Game`, values.game, true)
    .addField(`Favorite Movie`, values.movie, true)
    .addField(`Pet`, values.pet, true)
    .addField(`About Me`, values.extra, true);

  return channel.send(embed);
}
