import { DocumentType } from "@typegoose/typegoose";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import IntroGroup from ".";
import { channels } from "../../config";
import DbGuild from "../../models/guild";
import DbUser, { Intro } from "../../models/user";
import { question } from "../../util";

export default class StartCommand extends IntroGroup {
  name = "start";
  description = "Start your introduction questions";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    const introChannel = message.guild.channels.resolve(
      channels.intros
    ) as TextChannel;
    const dm = await message.author.createDM();

    const name = await question(message, dm, `What is your name?`);
    if (!name) return;

    const age = await question(message, dm, `What is your age?`);
    if (!age) return;

    const location = await question(message, dm, `What is your country?`);
    if (!location) return;

    const language = await question(message, dm, `What is your language?`);
    if (!language) return;

    const hobbies = await question(
      message,
      dm,
      `List some of your hobbies. (Seperate them with commas)`
    );
    if (!hobbies) return;

    const game = await question(message, dm, `What is your favorite game?`);
    if (!game) return;

    const movie = await question(message, dm, `What is your favorite movie?`);
    if (!movie) return;

    const pet = await question(
      message,
      dm,
      `Do you have a pet? If so what is it!`
    );
    if (!pet) return;

    const extra = await question(message, dm, `Tell us more about yourself.`);
    if (!extra) return;

    const icon = await question(
      message,
      dm,
      "Please send a link of the logo you would like to use."
    );
    if (!icon) return;

    const introMessage = await introChannel.send(
      new MessageEmbed()
        .setTitle(`${message.author.username}'s Intro`)
        .setDescription(`Welcome ${name.content} to the discord server.`)
        .setThumbnail(icon.content)
        .addField(`Name`, name.content, true)
        .addField(`Age`, age.content, true)
        .addField(`Location`, location.content, true)
        .addField(`Language`, language.content, true)
        .addField(`Hobbies`, hobbies.content, true)
        .addField(`Favorite Game`, game.content, true)
        .addField(`Favorite Movie`, movie.content, true)
        .addField(`Pet`, pet.content, true)
        .addField(`Extra`, extra.content, true)
    );

    userData.intro = new Intro(
      introMessage.id,
      name.content,
      age.content,
      location.content,
      language.content,
      hobbies.content,
      game.content,
      movie.content,
      pet.content,
      extra.content,
      icon.content
    );
    await userData.save();
  }
}
