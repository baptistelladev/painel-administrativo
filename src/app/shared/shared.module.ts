import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { BrowserModule } from '@angular/platform-browser';
import { MomentDatePipe } from './pipes/moment-date.pipe';
@NgModule({
  imports: [
    MomentDatePipe
  ],
  exports: [
    IonicModule,
    FormsModule,
    CommonModule,
    ReactiveFormsModule,
    MomentDatePipe
  ]
})
export class SharedModule { }
