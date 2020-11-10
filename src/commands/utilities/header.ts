import { Message, MessageEmbed } from "discord.js";
import UtilityGroup from ".";
import embeds from "../../util/embeds";
import { createCanvas, loadImage, registerFont } from "canvas";

registerFont("./src/assets/Multi.ttf", { family: "Multi" });

export default class HeaderCommand extends UtilityGroup {
  name = "header";
  description = "Create a header in an embed.";

  async run(message: Message, args: string[]) {
    const header = args.join(" ")
      ? args.join(" ")?.length > 15
        ? args.join(" ").slice(0, 15).trim()
        : args.join(" ")
      : null;
    if (!header)
      return message.channel.send(
        embeds.error(`Please provide the word(s) you would like on the header!`)
      );

    const background = await loadImage("./src/assets/background.png");
    const canvas = createCanvas(background.width, background.height);
    const ctx = canvas.getContext("2d");
    ctx.drawImage(background, 0, 0);

    ctx.fillStyle = "white";
    ctx.font = "80px 'Multi'";
    ctx.textAlign = "center";
    ctx.fillText(
      header.toUpperCase(),
      background.width / 2,
      background.height / 2 + 35
    );

    message.channel.send(
      new MessageEmbed()
        .setColor("#2C2F33")
        .attachFiles([
          {
            attachment: canvas.toBuffer("image/png"),
            name: "header.png",
          },
        ])
        .setImage("attachment://header.png")
    );
  }
}
