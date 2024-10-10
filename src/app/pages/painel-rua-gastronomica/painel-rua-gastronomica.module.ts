import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PainelRuaGastronomicaPageRoutingModule } from './painel-rua-gastronomica-routing.module';

import { PainelRuaGastronomicaPage } from './painel-rua-gastronomica.page';
import { RegisterShortEstablishmentModalComponent } from './modais/register-short-establishment-modal/register-short-establishment-modal.component';
import { HttpClient } from '@angular/common/http';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PainelRuaGastronomicaPageRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  declarations: [PainelRuaGastronomicaPage, RegisterShortEstablishmentModalComponent]
})
export class PainelRuaGastronomicaPageModule {}
