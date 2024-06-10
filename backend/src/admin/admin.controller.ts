import {
  BadGatewayException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Post,
  Query,
} from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Telegraf } from 'telegraf';
import { CustomContext } from './context.interface';
import { SharedStateService } from 'src/state/shared_state.ts.service';
import { UserBadWordObject } from 'src/types/telegram.types';
import { DatabaseService } from 'src/database/database.service';
/* quantidade de infrações pra acontecer o primeiro timeout -> isso vai ter um default
 * setar a duração do timeout -> isso vai ter um default
 * quantas infrações pra finalmente dar um ban -> vai ter um default
 * */

@Controller('admin')
export class AdminController {
  constructor(
    @InjectBot() private bot: Telegraf<CustomContext>,
    private state: SharedStateService,
    private database: DatabaseService,
  ) {}

  @Get('get-data')
  async getChatsData() {
    const usersData = await this.database.getAllUserData();
    const chatsData = await this.database.getChats();
    return { data: usersData, chats: chatsData };
  }

  @Get('notification')
  newMovementOccurred(@Query('date') date: Date) {
    date = new Date(date);

    if (typeof this.state.lastOccurrence === 'undefined') {
      return { occurred: false };
    }

    if (this.state.lastOccurrence!.getTime() > date.getTime()) {
      return { occurred: true };
    }

    return { occurred: false };
  }

  @Post('free-user')
  async emptyUserInfractions(@Body() body: UserBadWordObject) {
    let userData = await this.state.getUserData(body.chatId, body.userId);
    if (typeof userData === 'undefined') {
      throw new NotFoundException();
    }
    userData.badWords.length = 0;
    await this.database.saveUserLogToDatabase(userData);

    try {
      await this.bot.telegram.restrictChatMember(
        userData.chatId,
        userData.userId,
        {
          permissions: {
            can_send_polls: true,
            can_change_info: true,
            can_send_audios: true,
            can_send_photos: true,
            can_send_videos: true,
            can_invite_users: true,
            can_pin_messages: true,
            can_manage_topics: true,
            can_send_messages: true,
            can_send_documents: true,
            can_send_video_notes: true,
            can_send_voice_notes: true,
            can_send_other_messages: true,
            can_add_web_page_previews: true,
          },
        },
      );
    } catch {
      throw new BadGatewayException();
    }

    try {
      await this.bot.telegram.unbanChatMember(
        userData.chatId,
        userData.userId,
        { only_if_banned: true },
      );
    } catch {
      throw new BadGatewayException();
    }
  }

  @Post('/ban-user')
  async banUser(@Body() userData: UserBadWordObject) {
    try {
      await this.bot.telegram.banChatMember(userData.chatId, userData.userId);
    } catch {}
  }

  @Post('/timeout-user')
  async timeoutUser(@Body() userData: UserBadWordObject) {
    try {
      await this.bot.telegram.restrictChatMember(
        userData.chatId,
        userData.userId,
        {
          until_date: (Date.now() + 35000) / 1000,
          permissions: {
            can_send_polls: false,
            can_change_info: false,
            can_send_audios: false,
            can_send_photos: false,
            can_send_videos: false,
            can_invite_users: false,
            can_pin_messages: false,
            can_manage_topics: false,
            can_send_messages: false,
            can_send_documents: false,
            can_send_video_notes: false,
            can_send_voice_notes: false,
            can_send_other_messages: false,
            can_add_web_page_previews: false,
          },
        },
      );
    } catch {}
  }
}
