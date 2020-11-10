import Event from ".";
import Logger from "../util/logger";

export default class botStarted extends Event {
  name = "ready";

  async handle() {
    Logger.info(
      "BOT",
      `Logged in as ${this.client.user.tag} (${this.client.user.id})`
    );
  }
}
