import { Injectable } from '@nestjs/common';
import { Ctx, Hears, Help, On, Start, Update } from 'nestjs-telegraf';
import { Context } from 'telegraf';

@Update()
@Injectable()
export class AppService {
  //bad_words = ["gordo"]
  getHello(): string {
    return 'Hello World!';
  }
  @Start()
  async startCommand(@Ctx() ctx: Context) {
    await ctx.reply('Welcome');
  }

  @Help()
  async helpCommand(ctx: Context) {
    await ctx.reply('Send me a sticker');
  }

  @On('sticker')
  async onSticker(ctx: Context) {
    await ctx.reply('👍');
  }

  @Hears('hi')
  async hearsHi(@Ctx() ctx: Context) {
    await ctx.reply('Hey there');
  }

  //@Command('adicionar_palavra')
  //async addBadWord(@Ctx() ctx: Context) {
  //  console.log(ctx.message)
  //  //this.bad_words.push(ctx.message as unknown as string)
  //  await ctx.reply("palavra adicionada");
  //}
//
  //@On('text')
  //onMessage(
  //  @Message() reversedText: string,
  //): string {
  //  return reversedText; 
  //}
}
