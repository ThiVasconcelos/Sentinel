import { Injectable } from '@nestjs/common';
import { CosmosClient } from '@azure/cosmos';
import { ConfigService } from '@nestjs/config';
import { UserBadWordObject } from 'src/types/telegram.types';

@Injectable()
export class DatabaseService {
  cosmosClient: CosmosClient;
  databaseId = 'SampleDB';
  containerId = 'BadWords';
  partitionKey = { kind: 'Hash', paths: ['/partitionKey'] };

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
}
