import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { AdmsPageRoutingModule } from './adms-routing.module';
import { AdmsPage } from './adms.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/components.module';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    AdmsPageRoutingModule
  ],
  declarations: [AdmsPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AdmsPageModule {}
