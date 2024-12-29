import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
import { IonicModule } from '@ionic/angular';
import { EstablishmentModalComponent } from './modais/establishment-modal/establishment-modal.component';
import { LogoComponent } from './logo/logo.component';
import { ChangeCityButtonComponent } from './change-city-button/change-city-button.component';
import { MadeWLoveComponent } from './made-w-love/made-w-love.component';
import { SuggestionModalComponent } from './modais/suggestion-modal/suggestion-modal.component';
import { UsersModalComponent } from './modais/users-modal/users-modal.component';

@NgModule({
  declarations: [
    AddComponent,
    EstablishmentModalComponent,
    LogoComponent,
    ChangeCityButtonComponent,
    MadeWLoveComponent,
    SuggestionModalComponent,
    UsersModalComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    AddComponent,
    EstablishmentModalComponent,
    LogoComponent,
    ChangeCityButtonComponent,
    MadeWLoveComponent,
    SuggestionModalComponent,
    UsersModalComponent
  ]
})
export class ComponentsModule { }
