import { getModelForClass, prop } from "@typegoose/typegoose";

export default class Emoji {
  @prop()
  emojiId: string;

  @prop({ type: String, default: [] })
  lockedRoles: string[];
}

export const EmojiModel = getModelForClass(Emoji);
