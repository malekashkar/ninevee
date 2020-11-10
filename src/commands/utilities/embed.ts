import { Message, MessageEmbed } from "discord.js";
import UtilityGroup from ".";

export default class EmbedCommand extends UtilityGroup {
  name = "embed";
  description = "Create a message embed.";

  async run(message: Message, args: string[]) {
    const content = message.content.split(this.name).slice(1).join(" ");
    let description: string = content;
    let title: string;

    if (content.includes("^")) {
      title = content.split("^")[0].trim();
      description = content.split("^").slice(1).join(" ").trim();
    }

    const embed = new MessageEmbed().setColor("#2C2F33");
    if (title) embed.setTitle(title);
    if (description) embed.setDescription(description);
    message.channel.send(embed);
  }
}
