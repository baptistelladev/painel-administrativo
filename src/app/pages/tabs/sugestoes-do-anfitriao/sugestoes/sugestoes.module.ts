import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { SugestoesPageRoutingModule } from './sugestoes-routing.module';
import { SugestoesPage } from './sugestoes.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/components.module';

@NgModule({
  imports: [
    SharedModule,
    SugestoesPageRoutingModule,
    ComponentsModule
  ],
  declarations: [SugestoesPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class SugestoesPageModule {}
