import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TelegramController } from './features/telegram/telegram.controller';
import { TelegramController } from './features/telegram/telegram.controller';

@Module({
  imports: [],
  controllers: [AppController, TelegramController],
  providers: [AppService],
})
export class AppModule {}
