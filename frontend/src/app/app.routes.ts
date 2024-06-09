import { RouterModule, Routes } from '@angular/router';
import { Tab1Component } from './tab1/tab1.component';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';

export const routes: Routes = [
  { path: '', component: LoginComponent },
  { path: 'tab1', component: Tab1Component },
];
