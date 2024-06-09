import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatTabsModule } from '@angular/material/tabs';
@Component({
  selector: 'app-tab1',
  standalone: true,
  imports: [MatTabsModule],
  templateUrl: './tab1.component.html',
  styleUrl: './tab1.component.css',
})
export class Tab1Component {
  showMenuProfile = false;
  showNotifica = false;
  dropdown() {
    this.showMenuProfile = !this.showMenuProfile;
  }
  dropdownNotifica() {
    this.showNotifica = !this.showNotifica;
  }
}
