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
