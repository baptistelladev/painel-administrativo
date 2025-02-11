import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FestivalDeComidaJaponesaPageRoutingModule } from './festival-de-comida-japonesa-routing.module';
import { FestivalDeComidaJaponesaPage } from './festival-de-comida-japonesa.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/components.module';

@NgModule({
  imports: [
    SharedModule,
    FestivalDeComidaJaponesaPageRoutingModule,
    ComponentsModule
  ],
  declarations: [FestivalDeComidaJaponesaPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class FestivalDeComidaJaponesaPageModule {}
