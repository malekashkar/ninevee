import { getModelForClass, prop } from "@typegoose/typegoose";

export class Intro {
  @prop()
  introMessageId?: string;

  @prop()
  name?: string;

  @prop()
  age?: string;

  @prop()
  location?: string;

  @prop()
  language?: string;

  @prop()
  hobbies?: string;

  @prop()
  game?: string;

  @prop()
  movie?: string;

  @prop()
  pet?: string;

  @prop()
  extra?: string;

  @prop()
  icon?: string;

  constructor(
    introMessageId?: string,
    name?: string,
    age?: string,
    location?: string,
    language?: string,
    hobbies?: string,
    game?: string,
    movie?: string,
    pet?: string,
    extra?: string,
    icon?: string
  ) {
    this.introMessageId = introMessageId;
    this.name = name;
    this.age = age;
    this.location = location;
    this.language = language;
    this.hobbies = hobbies;
    this.game = game;
    this.movie = movie;
    this.pet = pet;
    this.extra = extra;
    this.icon = icon;
  }
}

export default class DbUser {
  @prop()
  userId!: string;

  @prop({ default: {} })
  intro?: Intro;
}

export const UserModel = getModelForClass(DbUser);
export type IIntro = keyof Intro;
