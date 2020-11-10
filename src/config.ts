const prefixes = {
  EmojiLocker: "e!",
  Intro: "i!",
  Utility: "u!",
};

export interface ICategories {
  EmojiLocker: string;
  Intro: string;
  Utility: string;
}

const reactionRoles = [
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

const emojis = [
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

const channels = {
  intros: "765185760416235542"
}

export default {
  presence: `Vee and Nine`,
  prefixes,
  reactionRoles,
  emojis,
  channels
};
