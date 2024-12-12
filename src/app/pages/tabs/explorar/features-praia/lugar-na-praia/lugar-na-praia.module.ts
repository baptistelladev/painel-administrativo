import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LugarNaPraiaPageRoutingModule } from './lugar-na-praia-routing.module';

import { LugarNaPraiaPage } from './lugar-na-praia.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    LugarNaPraiaPageRoutingModule
  ],
  declarations: [LugarNaPraiaPage]
})
export class LugarNaPraiaPageModule {}
