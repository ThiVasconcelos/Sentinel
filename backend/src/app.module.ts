import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TelegrafModule } from 'nestjs-telegraf';
import { AdminController } from './admin/admin.controller';
import { SharedStateService } from './state/shared_state.ts.service';
import { DatabaseService } from './database/database.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    TelegrafModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        token: '7371843897:AAFgrp2jdj2HEcLl3JbTP31sCpAUrpfNyjk',
      }),
      inject: [ConfigService],
    }),
  ],
  controllers: [AppController, AdminController],
  providers: [AppService, SharedStateService, DatabaseService],
})
export class AppModule {}
