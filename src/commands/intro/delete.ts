import { DocumentType } from "@typegoose/typegoose";
import { Message, TextChannel } from "discord.js";
import IntroGroup from ".";
import config from "../../config";
import DbGuild from "../../models/guild";
import DbUser from "../../models/user";
import embeds from "../../util/embeds";

export default class StartCommand extends IntroGroup {
  name = "delete";
  description = "Delete your introduction questions";

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
    if (introMessage && introMessage.deletable) await introMessage.delete();

    userData.intro = null;
    await userData.save();

    message.channel.send(
      embeds.normal(
        `Profile Deleted`,
        `Your profile has been successfuly deleted.`
      )
    );
  }
}
