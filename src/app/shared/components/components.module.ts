import { SharedModule } from 'src/app/shared/shared.module';
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
import { UserInfoModalComponent } from './modais/user-info-modal/user-info-modal.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CidadesModalComponent } from './modais/cidades-modal/cidades-modal.component';

@NgModule({
  declarations: [
    AddComponent,
    EstablishmentModalComponent,
    LogoComponent,
    ChangeCityButtonComponent,
    MadeWLoveComponent,
    SuggestionModalComponent,
    UsersModalComponent,
    UserInfoModalComponent,
    CidadesModalComponent
  ],
  imports: [
    CommonModule,
    IonicModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    AddComponent,
    EstablishmentModalComponent,
    LogoComponent,
    ChangeCityButtonComponent,
    MadeWLoveComponent,
    SuggestionModalComponent,
    UsersModalComponent,
    UserInfoModalComponent,
    CidadesModalComponent
  ]
})
export class ComponentsModule { }
