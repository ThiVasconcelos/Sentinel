type LanguageCode = 'pt-br';
type ChatType = 'private' | 'group' | 'supergroup' | 'channel';

export interface ChatInfo {
  id: string;
  chatId: number;
  chatTitle: string;
  timeoutQuantity: number;
  timeoutDuration: number;
  banQuantity: number;
}

export interface BadWords {
  date_sent: Date;
  text: string;
}

export interface UserBadWordObject {
  id: string;
  userId: number;
  userName: string;
  chatId: number;
  chatTitle: string;
  badWords: BadWords[];
}

export const enum UserPunishmentEnum {
  NONE = 0,
  SUSPENSION = 1,
  BAN = 2,
}

export interface UserInfractionResponse {
  count: number;
  message: string;
  punishment: UserPunishmentEnum;
}

export interface TelegramMessageFrom {
  id: number;
  is_bot: boolean;
  first_name: string;
  last_name: string;
  language_code: LanguageCode;
}

export interface TelegramMessageChat {
  id: number;
  type: ChatType;
  first_name: string | undefined;
  last_name: string | undefined;
  title: string | undefined;
  username: string | undefined;
  is_forum: true | undefined;
}

export interface TelegramMessageEntity {
  offset: number;
  length: number;
  type: string;
}

export interface TelegramMessage {
  message_id: number;
  from: TelegramMessageFrom;
  chat: TelegramMessageChat;
  date: number;
  text: string | undefined;
  entities?: TelegramMessageEntity[];
}
