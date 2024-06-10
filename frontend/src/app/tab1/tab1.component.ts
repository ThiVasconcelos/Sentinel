import { Component, WritableSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
import { SentinelApi } from '../api/sentinel.api';
import { ChatInfo, UserBadWordObject } from '../types/sentinel.types';
import { first } from 'rxjs';
@Component({
  selector: 'app-tab1',
  standalone: true,
  imports: [MatTabsModule, CommonModule],
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

  chatBadWords: WritableSignal<UserBadWordObject[] | undefined> = signal(undefined);
  chats: WritableSignal<ChatInfo[] | undefined> = signal(undefined);

  constructor(private api: SentinelApi) {}

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

    this.api
      .getChatsData()
      .pipe(first())
      .subscribe(data => {
        this.chatBadWords.set(data.data);
        this.chats.set(data.chats);
      });
  }
}
