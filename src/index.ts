import path from "path";
import fs from "fs";
import Logger from "./util/logger";
import mongoose from "mongoose";
import Command from "./commands";
import Event from "./events";
import { Collection, Invite, Client, ClientOptions } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

export default class Bot extends Client {
  commands: Collection<string, Command> = new Collection();
  invites: Collection<string, Collection<string, Invite>> = new Collection();

  constructor(options?: ClientOptions) {
    super({
      ...options,
      partials: ["USER", "CHANNEL", "GUILD_MEMBER", "MESSAGE", "REACTION"],
    });

    this.loadDatabase();
    this.loadCommands();
    this.loadEvents();
  }

  loadDatabase() {
    mongoose.connect(
      process.env.MONGO_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
        connectTimeoutMS: 60000,
        socketTimeoutMS: 60000,
        serverSelectionTimeoutMS: 60000,
      },
      (err) => {
        if (err) Logger.error("DB", err);
        else Logger.info("DB", `The database has been connected successfully.`);
      }
    );
  }

  loadCommands(directory: string = path.join(__dirname, "commands")) {
    const directoryStats = fs.statSync(directory);
    if (!directoryStats.isDirectory()) return;

    const commandFiles = fs.readdirSync(directory);
    for (const commandFile of commandFiles) {
      const commandPath = path.join(directory, commandFile);
      const commandFileStats = fs.statSync(commandPath);
      if (!commandFileStats.isFile()) {
        this.loadCommands(commandPath);
        continue;
      }
      if (
        !commandFileStats.isFile() ||
        !/^.*\.(js|ts|jsx|tsx)$/i.test(commandFile) ||
        path.parse(commandPath).name === "index"
      )
        continue;

      const tmpCommand = require(commandPath);
      const command =
        typeof tmpCommand !== "function" &&
        typeof tmpCommand.default === "function"
          ? tmpCommand.default
          : typeof tmpCommand === "function"
          ? tmpCommand
          : null;

      try {
        const commandObj: Command = new command(this);
        if (commandObj && commandObj.name) {
          if (this.commands.has(commandObj.name)) {
            Logger.error(
              `DUPLICATE_COMMAND`,
              `Duplicate command ${commandObj.name}.`
            );
          } else this.commands.set(commandObj.name, commandObj);
        }
      } catch (e) {}
    }
  }

  loadEvents(directory = path.join(__dirname, "events")) {
    const directoryStats = fs.statSync(directory);
    if (!directoryStats.isDirectory()) return;

    const eventFiles = fs.readdirSync(directory);
    for (const eventFile of eventFiles) {
      const eventPath = path.join(directory, eventFile);
      const eventFileStats = fs.statSync(eventPath);
      if (!eventFileStats.isFile()) {
        this.loadEvents(eventPath);
        continue;
      }
      if (
        !eventFileStats.isFile() ||
        !/^.*\.(js|ts|jsx|tsx)$/i.test(eventFile) ||
        path.parse(eventPath).name === "index"
      )
        continue;

      const tmpEvent = require(eventPath);
      const event =
        typeof tmpEvent.default === "function" ? tmpEvent.default : null;
      if (!event) return;

      try {
        const eventObj: Event = new event(this);
        if (eventObj?.name)
          this.addListener(eventObj.name, async (...args) => {
            eventObj.handle.bind(eventObj)(...args, eventObj.name);
          });
      } catch (ignored) {}
    }
  }
}

new Bot().login(process.env.TOKEN);
