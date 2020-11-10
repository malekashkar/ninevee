import { ClientEvents } from "discord.js";
export type EventNameType = keyof ClientEvents;
import Client from "..";

export default abstract class Event {
  client: Client;
  module: string;
  disabled = false;
  abstract name: string;

  constructor(client: Client) {
    this.client = client;
  }

  abstract async handle(...args: unknown[]): Promise<void>;
}
