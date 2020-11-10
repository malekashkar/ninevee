import { DocumentType } from "@typegoose/typegoose";
import { Message, MessageEmbed, TextChannel } from "discord.js";
import IntroGroup from ".";
import config from "../../config";
import DbGuild from "../../models/guild";
import DbUser, { IIntro, Intro } from "../../models/user";
import { question } from "../../util";
import embeds from "../../util/embeds";

export default class StartCommand extends IntroGroup {
  name = "edit";
  description = "Edit your introduction questions";

  async run(
    message: Message,
    args: string[],
    userData: DocumentType<DbUser>,
    guildData: DocumentType<DbGuild>
  ) {
    if (!userData.intro.introMessageId)
      return message.channel.send(
        embeds.error(
          `Please run the \`start\` command before using the edit command!`
        )
      );

    const options = [
      "name",
      "age",
      "location",
      "language",
      "hobbies",
      "game",
      "movie",
      "pet",
      "extra",
      "icon",
      "all",
    ];
    const choice = options.find(
      (x) => x.toLowerCase() === args[0].toLowerCase()
    );
    const dm = await message.author.createDM();
    const introChannel = message.guild.channels.resolve(
      config.channels.intros
    ) as TextChannel;
    if (!introChannel)
      return message.channel.send(
        embeds.error(`The intro channel was not found!`)
      );

    const introMessage = await introChannel.messages.fetch(
      userData.intro.introMessageId
    );

    if (!choice)
      return message.channel.send(
        embeds.error(
          `Please provide one of the following choices to edit.\n\`${options.join(
            ", "
          )}\`.`
        )
      );

    if (choice === "all") {
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

      const embed = new MessageEmbed()
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
        .addField(`Extra`, extra.content, true);

      if (!introMessage.deleted) await introMessage.edit(embed);
      else await introChannel.send(embed);

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
    } else {
      const field = await question(
        message,
        dm,
        `What would you like to change your ${choice} to?`
      );
      if (!field) return;

      userData.intro[choice as IIntro] = field.content;
      await userData.save();

      const embed = new MessageEmbed()
        .setTitle(`${message.author.username}'s Intro`)
        .setDescription(`Welcome ${userData.intro.name} to the discord server.`)
        .setThumbnail(userData.intro.icon)
        .addField(`Name`, userData.intro.name, true)
        .addField(`Age`, userData.intro.age, true)
        .addField(`Location`, userData.intro.location, true)
        .addField(`Language`, userData.intro.language, true)
        .addField(`Hobbies`, userData.intro.hobbies, true)
        .addField(`Favorite Game`, userData.intro.game, true)
        .addField(`Favorite Movie`, userData.intro.movie, true)
        .addField(`Pet`, userData.intro.pet, true)
        .addField(`Extra`, userData.intro.extra, true);

      if (!introMessage.deleted) await introMessage.edit(embed);
      else await introChannel.send(embed);
    }
  }
}
