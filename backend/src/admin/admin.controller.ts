import { Body, Controller, Get, Post } from '@nestjs/common';
import { InjectBot } from 'nestjs-telegraf';
import { Scenes, Telegraf } from 'telegraf';
import { CustomContext } from './context.interface';
import { SharedStateService } from 'src/state/shared_state.ts.service';
import { UserBadWordCount } from 'src/types/telegram.types';

@Controller('admin')
export class AdminController {
  constructor(
    @InjectBot() private bot: Telegraf<CustomContext>,
    private state: SharedStateService,
  ) {}

  @Post('free-user')
  async emptyUserInfractions(@Body() userData: UserBadWordCount) {
    let badWords = this.state.badWordsCount
      .get(userData.chat_id)
      .get(userData.user_id);

    badWords.length = 0;

    try {
      await this.bot.telegram.restrictChatMember(
        userData.chat_id,
        userData.user_id,
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
    } catch {}
  }

  @Post('/ban-user')
  async banUser(@Body() userData: UserBadWordCount) {
    try {
      await this.bot.telegram.banChatMember(userData.chat_id, userData.user_id);
    } catch {}
  }

  @Post('/timeout-user')
  async timeoutUser(@Body() userData: UserBadWordCount) {
    try {
      await this.bot.telegram.restrictChatMember(
        userData.chat_id,
        userData.user_id,
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
