export interface BadWords {
  date_sent: Date;
  text: string;
}

export interface UserBadWordObject {
  id: string;
  userId: number;
  chatId: number;
  badWords: BadWords[];
}
