import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LugarNaPraiaPageRoutingModule } from './lugar-na-praia-routing.module';

import { LugarNaPraiaPage } from './lugar-na-praia.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    LugarNaPraiaPageRoutingModule
  ],
  declarations: [LugarNaPraiaPage]
})
export class LugarNaPraiaPageModule {}
