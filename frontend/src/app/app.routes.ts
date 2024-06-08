import { RouterModule, Routes } from '@angular/router';
import { Tab1Component } from './tab1/tab1.component';
import { NgModule } from '@angular/core';
const routes: Routes = [
    { path: 'tab1', component: Tab1Component }
  ];
  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule { }