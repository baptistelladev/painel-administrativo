import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BrowserModule } from '@angular/platform-browser';
@NgModule({
  exports: [
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule
  ]
})
export class SharedModule { }
