import { DocumentType } from "@typegoose/typegoose";
import { Message, TextChannel } from "discord.js";
import IntroGroup from ".";
import { channels, introOptions } from "../../config";
import DbUser, { IIntro } from "../../models/user";
import { question } from "../../util";
import embeds from "../../util/embeds";
import { editMessage } from "../../util/introUtilities";

export default class StartCommand extends IntroGroup {
  name = "edit";
  description = "Edit your introduction questions";
  usage = "<option>";

  async run(message: Message, args: string[], userData: DocumentType<DbUser>) {
    if (!userData.intro?.introMessageId)
      return message.channel.send(
        embeds.error(
          `Please run the \`start\` command before using the edit command!`
        )
      );

    if (!isNaN(parseInt(args[0]))) {
      const numberChoice = parseInt(args.shift());
      const dmChannel = await message.author.createDM();

      const introChannel = message.guild.channels.resolve(
        channels.intros
      ) as TextChannel;
      if (!introChannel)
        return message.channel.send(
          embeds.error(
            `Please send this error to an administrator!\n\`The intro channel could not be found!\``
          )
        );

      const introMessage = await introChannel.messages.fetch(
        userData.intro?.introMessageId
      );
      if (!introMessage) {
        message.channel.send(
          embeds.error(
            `Your intro message could not be found, please run the \`start\` message again!`
          )
        );
        userData.intro = null;
        await userData.save();
        return;
      }

      if (numberChoice === 0) {
        for (const option in introOptions) {
          const questionText = introOptions[option as IIntro];
          const optionAnswer = await question(
            message.author,
            dmChannel,
            questionText
          );
          if (optionAnswer) {
            userData.intro[option as IIntro] = optionAnswer.content;
          } else return;
        }
        await editMessage(introMessage, userData.intro);
        await userData.save();
      } else {
        const option = Object.entries(introOptions)[numberChoice];
        if (!option)
          return message.channel.send(
            embeds.error(
              `There is no such option as ${numberChoice}, please use the \`options\` command to check your available options.`
            )
          );

        const optionAnswer = await question(
          message.author,
          dmChannel,
          option[1]
        );
        if (optionAnswer) {
          userData.intro[option[0] as IIntro] = optionAnswer.content;
          await userData.save();
          await editMessage(message, userData.intro);
        }
      }
    } else
      return message.channel.send(
        embeds.error(
          `Please run the \`options\` command to see what options you can change!`
        )
      );
  }
}
