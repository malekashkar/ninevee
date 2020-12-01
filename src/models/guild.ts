import { getModelForClass, prop } from "@typegoose/typegoose";

class ReactionRoles {
  @prop({ required: true })
  roleId: string;
}

class Messages {
  @prop({ required: false })
  reactionRoles: string;
}

export default class DbGuild {
  @prop({ required: true })
  guildId: string;

  @prop({ required: false, type: String })
  autoRoles?: string[];

  @prop({ required: false, type: String })
  syncedroles?: string[];

  @prop({ required: false, type: ReactionRoles })
  reactionRoles?: ReactionRoles[];

  @prop({ required: false, type: Messages, default: {} })
  messages?: Messages;
}

export const GuildModel = getModelForClass(DbGuild);
