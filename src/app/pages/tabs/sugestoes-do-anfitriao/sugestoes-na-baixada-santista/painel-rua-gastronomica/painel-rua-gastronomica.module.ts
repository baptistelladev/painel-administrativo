import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { PainelRuaGastronomicaPageRoutingModule } from './painel-rua-gastronomica-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { PainelRuaGastronomicaPage } from './painel-rua-gastronomica.page';
import { ComponentsModule } from 'src/app/shared/components/components.module';

@NgModule({
  imports: [
    SharedModule,
    PainelRuaGastronomicaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [
    PainelRuaGastronomicaPage
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class PainelRuaGastronomicaPageModule {}
