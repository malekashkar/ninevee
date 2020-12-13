import { IIntro } from "./models/user";

export const prefixes = {
  EmojiLocker: "e!",
  Intro: "i!",
  Utility: "u!",
};

export interface ICategories {
  EmojiLocker: string;
  Intro: string;
  Utility: string;
}

export type Categories = keyof ICategories;

export const reactionRoles = [
  "757585373386899629",
  "757585374456578178",
  "757585374938923110",
  "757585376062865626",
  "757585376872235028",
  "757585377476214815",
  "757585378193440789",
  "757585378898346065",
  "757585379573628959",
  "757585382065045586",
  "757585383004307466",
  "757585383520469103",
  "757585384552005723",
  "757585384833286146",
  "757585385726673138",
  "757585386729111612",
  "757585387433754664",
];

export const emojis = [
  "🇦",
  "🇧",
  "🇨",
  "🇩",
  "🇪",
  "🇫",
  "🇬",
  "🇭",
  "🇮",
  "🇯",
  "🇰",
  "🇱",
  "🇲",
  "🇳",
  "🇴",
  "🇵",
  "🇶",
  "🇷",
  "🇸",
  "🇹",
  "🇺",
  "🇻",
  "🇼",
  "🇽",
  "🇾",
  "🇿",
];

export const channels = {
  intros: "765185760416235542",
};

export const introOptions: { [key in IIntro]?: string } = {
  name: "What is your name?",
  age: "How old are you?",
  location: "What country/region are you from?",
  language: "What is your main language?",
  hobbies: "List some of your hobbies!",
  game: "What is your favorite game?",
  movie: "What is your favorite movie?",
  pet: "Do you have a pet? If so, what type!",
  extra: "Tell us more about yourself.",
  icon: "Send a link of the profile picture you would like to use.",
};
