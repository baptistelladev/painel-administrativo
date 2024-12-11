import { SharedModule } from './../shared/shared.module';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddComponent } from './add/add.component';
import { IonicModule } from '@ionic/angular';
import { EstablishmentModalComponent } from './modais/establishment-modal/establishment-modal.component';
import { LogoComponent } from './logo/logo.component';

@NgModule({
  declarations: [
    AddComponent,
    EstablishmentModalComponent,
    LogoComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    AddComponent,
    EstablishmentModalComponent,
    LogoComponent
  ]
})
export class ComponentsModule { }
