import { Message, Collection } from "discord.js";
import UtilityGroup from ".";
import embeds from "../../util/embeds";
import { Categories, emojis, prefixes } from "../../config";
import { react } from "../../util";

export interface IGroup {
  descriptions: string[];
}

export default class HelpCommand extends UtilityGroup {
  name = "help";
  description = "Receive the help message with all the information of the bot.";

  async run(message: Message) {
    const help: Collection<string, IGroup> = new Collection();

    for (const commandObj of this.client.commands.array()) {
      if (commandObj.disabled) continue;

      const prefix = `**${prefixes[commandObj.category as Categories]}`;
      const commandName = `${commandObj.name}**`;
      const commandDescription = ` ~ ${commandObj.description}`;
      const usage = commandObj.usage ? ` \`${commandObj.usage}\`` : "";

      const final = prefix + commandName + usage + commandDescription;

      const group = help.get(toTitleCase(commandObj.category));
      if (!group)
        help.set(toTitleCase(commandObj.category), {
          descriptions: [final],
        });
      else group.descriptions.push(final);
    }

    const modules: string[] = Array.from(help).map(([name, value]) => name);
    const helpEmojis = emojis.slice(0, modules.length);
    const fields = modules.map((name: string, i) => {
      return {
        name: `**${name}** commands`,
        value: `*react with ${helpEmojis[i]} to view*`,
        inline: true,
      };
    });

    const helpEmbed = embeds.empty().setTitle(`Help Menu`).addFields(fields);
    const helpMessage = await message.channel.send(helpEmbed);
    await react(helpMessage, helpEmojis);

    helpMessage
      .awaitReactions(
        (r, u) =>
          u.id === message.author.id && helpEmojis.includes(r.emoji.name),
        { max: 1, time: 60000, errors: ["time"] }
      )
      .then(async (category) => {
        const categoryName = toTitleCase(
          modules[helpEmojis.indexOf(category.first().emoji.name)]
        );
        const groupInfo = help.get(categoryName)?.descriptions.join("\n");

        await helpMessage.reactions.removeAll();
        await helpMessage.edit(
          embeds.normal(groupInfo, categoryName + ` | Commands Info`)
        );
      })
      .catch(async () => await helpMessage.reactions.removeAll());
  }
}

function toTitleCase(str: string) {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}
