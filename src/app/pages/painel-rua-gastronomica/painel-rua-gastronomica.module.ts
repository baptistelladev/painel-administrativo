import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PainelRuaGastronomicaPageRoutingModule } from './painel-rua-gastronomica-routing.module';

import { PainelRuaGastronomicaPage } from './painel-rua-gastronomica.page';
import { RegisterShortEstablishmentModalComponent } from './modais/register-short-establishment-modal/register-short-establishment-modal.component';
import { HttpClient } from '@angular/common/http';
import { RegisterShortParkingComponent } from './modais/register-short-parking/register-short-parking.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PainelRuaGastronomicaPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [
    PainelRuaGastronomicaPage,
    RegisterShortEstablishmentModalComponent,
    RegisterShortParkingComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PainelRuaGastronomicaPageModule {}
