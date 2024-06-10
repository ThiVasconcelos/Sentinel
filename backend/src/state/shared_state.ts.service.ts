import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database/database.service';
import { UserBadWordObject } from 'src/types/telegram.types';
import { v4 } from 'uuid';

@Injectable()
export class SharedStateService {
  badWordsCount: Map<number, Map<number, UserBadWordObject>> = new Map();
  timeoutMaxCount = 3;
  lastOccurrence: Date | undefined;

  constructor(private database: DatabaseService) {}

  async getUserData(
    chatId: number,
    userId: number,
  ): Promise<UserBadWordObject> {
    if (!this.badWordsCount.has(chatId)) {
      this.badWordsCount.set(chatId, new Map());
    }
    const chatMap = this.badWordsCount.get(chatId);
    if (!chatMap.has(userId)) {
      const userData = await this.database.getUserLogFromDatabase(
        chatId,
        userId,
      );
      if (typeof userData === 'undefined') {
        chatMap.set(userId, {
          id: v4(),
          chatId: chatId,
          userId: userId,
          badWords: [],
        });
      } else {
        chatMap.set(userId, {
          id: userData.id,
          chatId: userData.chatId,
          userId: userData.userId,
          badWords: userData.badWords,
        });
      }
    }

    let userData = chatMap.get(userId);
    return userData;
  }
}
