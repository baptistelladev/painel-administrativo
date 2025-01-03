import { NgModule } from '@angular/core';
import { LugarNaPraiaPageRoutingModule } from './lugar-na-praia-routing.module';
import { LugarNaPraiaPage } from './lugar-na-praia.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/components.module';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    LugarNaPraiaPageRoutingModule
  ],
  declarations: [LugarNaPraiaPage]
})
export class LugarNaPraiaPageModule {}
