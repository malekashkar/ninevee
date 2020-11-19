import { MessageEmbed } from "discord.js";

export default class embeds {
  static error(text: string, title = "Error Caught") {
    return new MessageEmbed()
      .setTitle(title)
      .setDescription(`${text}`)
      .setFooter(
        `For more help, contact an administrator with the information above.`
      )
      .setColor("RED")
      .setTimestamp();
  }

  static normal(text: string, title: string) {
    return new MessageEmbed()
      .setTitle(title)
      .setDescription(text)
      .setFooter(`Vee and Nine`)
      .setColor("RANDOM")
      .setTimestamp();
  }

  static question(text: string) {
    return new MessageEmbed()
      .setTitle(`You have 15 minutes to answer the question below.`)
      .setDescription(text)
      .setFooter(`Vee and Nine`)
      .setColor("RANDOM")
      .setTimestamp();
  }

  static empty() {
    return new MessageEmbed();
  }
}
