export interface NotificationInfo {
  date_sent: Date;
  text: string;
  chatTitle: string;
}

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
