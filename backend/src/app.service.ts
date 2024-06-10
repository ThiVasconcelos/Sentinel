import { BadGatewayException, Injectable } from '@nestjs/common';
import {
  Command,
  Ctx,
  Hears,
  Help,
  Message,
  On,
  Start,
  Update,
} from 'nestjs-telegraf';
import { Context } from 'telegraf';
import {
  TelegramMessage,
  UserInfractionResponse,
  UserPunishmentEnum,
} from './types/telegram.types';
import { v4 } from 'uuid';
import { SharedStateService } from './state/shared_state.ts.service';
import { DatabaseService } from './database/database.service';

@Update()
@Injectable()
export class AppService {
  badWords = [
    'gordo',
    'p4u',
    'filho da puta',
    'merdinha',
    'seu merda',
    'seu bosta',
    'fudido',
    'tu e um bosta',
    'tu é um bosta',
    'pedaço de bosta',
    'te fode',
    'puta',
    'arrombado',
    'chupa rola',
    'chupa meu pau',
    'chupa mel pal',
    'chupa mel pau',
    'chupa minha pica',
    'smt',
    'da o cu',
    'vsf',
    'vtnc',
    'viado',
    'viadinho',
    'gay',
    'traveco',
    'putinha',
    'se mata',
    'morre',
    'arromba',
    'caralho',
    'carlho',
    'c4ralho',
    'c4r4lh0',
    'porra',
    'carai',
    'vou te matar',
    'vou te mata',
    'me chupa',
    'me xupa',
    'mama aqui',
    'mama aki',
    'minha geba',
    'minha rola',
    'bolofofo',
    'leitãozinho',
    'preto',
    'negro',
    'criolo',
    'negresco',
    'xinguilingui',
    'xing ling',
    'pastel de flango',
    'da o ku',
    'tu e feio',
    'seu feio',
    'seu feioso',
    'sai feio',
    'tua bunda',
    'Energúmeno',
    'buceta de grilo',
    'parece um grilo',
    'tu e adotado',
    'seu adotado',
    'tu é adotado',
    'foda-se',
    'se foda',
    'fodase',
    'fodasse',
    'fds',
    'punheta',
    'punheteiro',
    'trepar',
    'cú',
    'ku',
    'xereca',
    'xoxota',
    'caceta',
    'pau',
    'pica',
    'boqueteira',
    'boqueteiro',
    'corno',
    'rapariga',
    'bicha',
    'brocha',
    'boiola',
    'cracudo',
    'g4y',
    'kenga',
    'tu é uma piranha',
    'sua piranha',
    'tua mãe é uma piranha',
    'tua mãe e uma piranha',
    'sua vaca',
    'monte de bosta',
    'monte de merda',
  ];
  constructor(
    private state: SharedStateService,
    private database: DatabaseService,
  ) {}

  @Start()
  async startCommand(@Ctx() ctx: Context) {
    await ctx.reply('Welcome');
  }

  @Command('adicionar_palavra')
  async addBadWord(@Message() message: TelegramMessage, @Ctx() ctx: Context) {
    let [_, ...rest] = message.text.split(' ');
    const word = rest.join(' ');
    this.badWords.push(word);
    await ctx.reply('palavra adicionada');
  }

  async returnOwnerId(ctx: Context): Promise<number> {
    const userData = await ctx.telegram.getChatAdministrators(
      ctx.message.chat.id,
    );
    for (const user of userData) {
      if (user.status === 'creator') {
        return user.user.id;
      }
    }
  }

  @Command('auth')
  async sendMessageToOwner(@Ctx() ctx: Context) {
    let userData = await ctx.getChatMember(ctx.from.id);
    if (userData.status !== 'creator') {
      return;
    }

    const result = await this.database.createChat(
      ctx.message as TelegramMessage,
    );
    if (result === 'error') {
      return;
    }
    try {
      await ctx.telegram.sendMessage(
        userData.user.id.toString(),
        `Use esse código para ver o monitoramento do grupo: ${v4()}`,
      );
    } catch {}
  }

  async incrementBadWord(message: TelegramMessage) {
    const userData = await this.state.getUserData(
      message.chat.id,
      message.from.id,
      message,
    );
    const date = new Date();
    this.state.lastOccurrence = date;
    userData.badWords.push({
      text: message.text.toLowerCase(),
      date_sent: date,
    });
    this.database.saveUserLogToDatabase(userData);
  }

  checkBadWordCount(
    userId: number,
    chatId: number,
    userName: string,
  ): UserInfractionResponse {
    const badWords = this.state.badWordsCount.get(chatId).get(userId).badWords;

    let userInfraction: UserInfractionResponse = {
      count: badWords.length,
      message: `Usuário ${userName} já está com ${badWords.length} infrações`,
      punishment: UserPunishmentEnum.NONE,
    };

    if (badWords.length > this.state.timeoutMaxCount + 50) {
      userInfraction.punishment = UserPunishmentEnum.BAN;
      userInfraction.message = `Usuário ${userName} passou dos limites, seje banido`;
    } else if (badWords.length >= this.state.timeoutMaxCount) {
      userInfraction.punishment = UserPunishmentEnum.SUSPENSION;
      const timeoutLeft = this.state.timeoutMaxCount + 2 - badWords.length;
      userInfraction.message = `Usuário ${userName} passou dos limites, tome timeout. Mais ${timeoutLeft} e você será banido.`;
    }

    return userInfraction;
  }

  @On('text')
  async onMessage(@Message() message: TelegramMessage, @Ctx() ctx: Context) {
    if (typeof message.text === 'undefined') {
      return;
    }

    let userData = await ctx.getChatMember(ctx.from.id);
    if (userData.status === 'creator') {
      return;
    }

    let madeInfraction = false;

    for (const word of this.badWords) {
      if (message.text.includes(word)) {
        await this.incrementBadWord(message);
        madeInfraction = true;
        await ctx.deleteMessage(message.message_id);
        break;
      }
    }

    if (madeInfraction) {
      const infractionResponse = this.checkBadWordCount(
        message.from.id,
        message.chat.id,
        `${message.from.first_name} ${message.from.last_name}`,
      );

      switch (infractionResponse.punishment) {
        case UserPunishmentEnum.NONE: {
          await ctx.reply(infractionResponse.message);
          break;
        }
        case UserPunishmentEnum.SUSPENSION: {
          await ctx.reply(infractionResponse.message);
          await ctx.restrictChatMember(message.from.id, {
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
          });
          break;
        }

        case UserPunishmentEnum.BAN: {
          await ctx.reply(infractionResponse.message);
          await ctx.banChatMember(message.from.id, (Date.now() + 35000) / 1000);
          break;
        }
      }
    }
  }
}
