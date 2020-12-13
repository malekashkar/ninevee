import { Message } from "discord.js";
import IntroGroup from ".";
import { introOptions } from "../../config";
import embeds from "../../util/embeds";

export default class OptionsCommand extends IntroGroup {
  name = "options";
  description = "check what options you can edit on your profile.";

  async run(message: Message) {
    const formattedOptions = Object.keys(introOptions).map(
      (option, i) => `**${i + 1}**. ${option}`
    );
    const embed = embeds
      .empty()
      .setTitle(`Profile Editing Options`)
      .setDescription(
        `Use the command \`edit <option number>\` to edit your profile.\n\n` +
          [`**0**. Edit all options`].concat(formattedOptions).join("\n")
      );
    return await message.channel.send(embed);
  }
}
