import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
import { CommonModule } from '@angular/common';
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
  dropdown() {
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
    this.showMenuProfile = false;
  }
  popUpGrupos() {
    this.grupos = true;
    this.monitoramento = false;
    this.config = false;
    this.showNotifica = false;
    this.showMenuProfile = false;
  }
  popUpConfig() {
    this.config = true;
    this.grupos = false;
    this.monitoramento = false;
    this.showMenuProfile = false;
    this.showNotifica = false;
  }
  novaNotifica = true;
  checkNotifica() {
    this.novaNotifica = false;
  }
  doubleCallNotifica() {
    this.dropdownNotifica();
    this.checkNotifica();
  }
}
