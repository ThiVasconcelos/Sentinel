import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getBotToken } from 'nestjs-telegraf';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  //app.use(bot.webhookCallback('/secret-path'));
  await app.listen(3000);
}
bootstrap();
