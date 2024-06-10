import { Component, WritableSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { SentinelApi } from '../api/sentinel.api';
import { BadWords, ChatInfo, NotificationInfo, UserBadWordObject } from '../types/sentinel.types';
import { first } from 'rxjs';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-tab1',
  standalone: true,
  imports: [MatTabsModule, CommonModule, MatIconModule, MatMenuModule, MatButtonModule],
  templateUrl: './tab1.component.html',
  styleUrl: './tab1.component.css',
})
export class Tab1Component {
  showMenuProfile = false;
  showNotifica = false;
  monitoramento = false;
  config = false;
  grupos = false;
  selecaoGrupos = false;
  novaNotifica = true;
  currGroup: number = 0;
  isInitialized: boolean = false;
  lastCheck: Date = new Date();
  chatBadWords: WritableSignal<UserBadWordObject[] | undefined> = signal(undefined);
  chats: WritableSignal<ChatInfo[] | undefined> = signal(undefined);
  lastThree: WritableSignal<NotificationInfo[] | undefined> = signal(undefined);

  constructor(private api: SentinelApi) {
    setInterval(async () => {
      let getDataAgain = false;
      const users = this.chatBadWords();
      if (typeof users !== 'undefined') {
        let lastDate: Date | undefined;
        for (const user of users) {
          for (const word of user.badWords) {
            const currDate = new Date(word.date_sent);
            if (typeof lastDate === 'undefined') {
              lastDate = currDate;
            }

            if (currDate.getTime() > lastDate!.getTime()) {
              lastDate = currDate;
            }
          }
        }

        if (typeof lastDate !== 'undefined') {
          this.api
            .hasAnotherInfractionOccurred(lastDate!)
            .pipe(first())
            .subscribe(data => {
              if (data.occurred) {
                this.api
                  .getChatsData()
                  .pipe(first())
                  .subscribe(data => {
                    this.chatBadWords.set(data.data);
                    this.chats.set(data.chats);
                    this.notificationData(data.data);
                  });
              }
            });
        }
      }

      if (new Date().getTime() > this.lastCheck.getTime() + 11000 && this.isInitialized) {
        getDataAgain = true;
      }

      if (getDataAgain === true) {
        this.lastCheck = new Date();
        this.api
          .getChatsData()
          .pipe(first())
          .subscribe(data => {
            this.chatBadWords.set(data.data);
            this.chats.set(data.chats);
            this.notificationData(data.data);
          });
      }
    }, 1000);
  }

  notificationData(users: UserBadWordObject[]) {
    let words: NotificationInfo[] = [];
    for (const user of users) {
      for (const word of user.badWords) {
        words.push({
          chatTitle: user.chatTitle,
          text: word.text,
          date_sent: word.date_sent,
        });
      }
    }

    words = words.sort((a, b) => {
      return b.date_sent < a.date_sent ? -1 : b.date_sent > a.date_sent ? 1 : 0;
    });
    if (words.length > 3) {
      words.length = 3;
    }
    this.lastThree.update(data => {
      if (typeof data !== 'undefined') {
        words = words.concat(data);
      }
      if (words.length > 3) {
        words.length = 3;
      }
      return words;
    });
  }

  async dropdown() {
    this.showMenuProfile = !this.showMenuProfile;
    this.showNotifica = false;
  }
  dropdownNotifica() {
    this.showNotifica = !this.showNotifica;
    this.showMenuProfile = false;
  }
  popUpMonitoramento() {
    this.monitoramento = true;
    this.config = false;
    this.grupos = false;
    this.showNotifica = false;
    this.selecaoGrupos = false;
    this.showMenuProfile = false;
  }
  popUpGrupos() {
    this.grupos = true;
    this.monitoramento = false;
    this.config = false;
    this.showNotifica = false;
    this.selecaoGrupos = false;
    this.showMenuProfile = false;
  }
  popUpConfig() {
    this.config = true;
    this.grupos = false;
    this.monitoramento = false;
    this.showMenuProfile = false;
    this.showNotifica = false;
    this.selecaoGrupos = false;
  }
  closePopUpConfig() {
    this.config = false;
    this.grupos = false;
    this.monitoramento = false;
    this.showMenuProfile = false;
    this.showNotifica = false;
    this.selecaoGrupos = false;
  }
  checkNotifica() {
    this.novaNotifica = false;
  }
  doubleCallNotifica() {
    this.dropdownNotifica();
    this.checkNotifica();
  }
  abrirGrupos() {
    this.config = false;
    this.grupos = false;
    this.monitoramento = false;
    this.showMenuProfile = false;
    this.showNotifica = false;
    this.selecaoGrupos = true;
    this.isInitialized = true;
    this.api
      .getChatsData()
      .pipe(first())
      .subscribe(data => {
        this.chatBadWords.set(data.data);
        this.chats.set(data.chats);
        this.notificationData(data.data);
        this.isInitialized = true;
      });
  }

  returnUsers() {
    let userSlice = [];
    for (const user of this.chatBadWords()!) {
      if (user.chatId === this.currGroup) {
        userSlice.push(user);
      }
    }

    return userSlice;
  }

  setGroupToSee(chatId: number) {
    this.currGroup = chatId;
    this.popUpMonitoramento();
  }

  async banUser(user: UserBadWordObject) {
    await this.api.banUser(user).pipe(first()).subscribe();
  }

  async timeoutUser(user: UserBadWordObject) {
    await this.api.timeoutUser(user).pipe(first()).subscribe();
  }

  async freeUser(user: UserBadWordObject) {
    await this.api.freeUser(user).pipe(first()).subscribe();
  }
}
