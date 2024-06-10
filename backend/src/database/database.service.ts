import { Injectable } from '@nestjs/common';
import { CosmosClient } from '@azure/cosmos';
import { ConfigService } from '@nestjs/config';
import {
  ChatInfo,
  TelegramMessage,
  UserBadWordObject,
} from 'src/types/telegram.types';
import { v4 } from 'uuid';

@Injectable()
export class DatabaseService {
  cosmosClient: CosmosClient;
  databaseId = 'SampleDB';
  containerId = 'BadWords';
  partitionKey = { kind: 'Hash', paths: ['/partitionKey'] };
  chatContainerId = 'Chats';

  constructor(private configService: ConfigService) {
    //const endpoint = configService.get<string>("COSMOSDB_ENDPOINT");
    const key = this.configService.get<string>('COSMOSDB_CONNECTION_STRING');
    //const partitionKey = { kind: 'Hash', paths: ['/partitionKey'] }

    this.cosmosClient = new CosmosClient(key);
  }

  async getUserLogFromDatabase(
    chatId: number,
    userId: number,
  ): Promise<UserBadWordObject | undefined> {
    const userData = await this.cosmosClient
      .database(this.databaseId)
      .container(this.containerId)
      .items.query(
        `SELECT * FROM c WHERE c.chatId=${chatId} AND c.userId=${userId}`,
      )
      .fetchNext();

    return userData.resources[0];
  }

  async getAllUserData(): Promise<UserBadWordObject[] | undefined> {
    const data = await this.cosmosClient
      .database(this.databaseId)
      .container(this.containerId)
      .items.query('SELECT * FROM c')
      .fetchAll();

    if (typeof data.resources === 'undefined') {
      return;
    }
    return data.resources;
  }

  async saveUserLogToDatabase(userData: UserBadWordObject) {
    await this.cosmosClient
      .database(this.databaseId)
      .container(this.containerId)
      .items.upsert(userData);
  }

  async createChat(message: TelegramMessage): Promise<string | undefined> {
    const createChat: ChatInfo = {
      id: v4(),
      chatTitle: message.chat.title,
      chatId: message.chat.id,
      timeoutQuantity: 2,
      timeoutDuration: 35,
      banQuantity: 4,
    };
    try {
      await this.cosmosClient
        .database(this.databaseId)
        .container(this.chatContainerId)
        .items.upsert(createChat);
    } catch {
      return 'error';
    }
  }

  async getChats(): Promise<ChatInfo[]> {
    const data = await this.cosmosClient
      .database(this.databaseId)
      .container(this.chatContainerId)
      .items.query('select * from c')
      .fetchAll();

    if (typeof data.resources === 'undefined') {
      return [];
    }

    return data.resources;
  }
}
