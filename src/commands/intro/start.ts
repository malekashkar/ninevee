import { DocumentType } from "@typegoose/typegoose";
import { Message, TextChannel } from "discord.js";
import IntroGroup from ".";
import { channels, introOptions } from "../../config";
import DbUser, { IIntro } from "../../models/user";
import { question } from "../../util";
import embeds from "../../util/embeds";
import { startMessage } from "../../util/introUtilities";

export default class StartCommand extends IntroGroup {
  name = "start";
  description = "Start your introduction questions";

  async run(message: Message, args: string[], userData: DocumentType<DbUser>) {
    if (userData.intro?.introMessageId)
      return message.channel.send(
        embeds.error(
          `You've already created a profile! Run the \`options\` command to see what you could edit!`
        )
      );

    const introChannel = message.guild.channels.resolve(
      channels.intros
    ) as TextChannel;
    const dmChannel = await message.author.createDM();

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
    userData.intro.introMessageId = (
      await startMessage(introChannel, userData.intro)
    ).id;
    await userData.save();

    return dmChannel.send(
      embeds.normal(
        `Your profile has been setup and posted in ${introChannel}!`,
        `Profile Complete`
      )
    );
  }
}
