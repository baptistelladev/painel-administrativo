import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PainelRuaGastronomicaPageRoutingModule } from './painel-rua-gastronomica-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PainelRuaGastronomicaPage } from './painel-rua-gastronomica.page';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, // Importando o IonicModule para usar ion-router-outlet
    PainelRuaGastronomicaPageRoutingModule,
    ComponentsModule,
    ReactiveFormsModule
  ],
  declarations: [
    PainelRuaGastronomicaPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PainelRuaGastronomicaPageModule {}
