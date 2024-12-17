import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LugarNaCidadePageRoutingModule } from './lugar-na-cidade-routing.module';

import { LugarNaCidadePage } from './lugar-na-cidade.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    SharedModule,
    LugarNaCidadePageRoutingModule,
    ComponentsModule
  ],
  declarations: [LugarNaCidadePage]
})
export class LugarNaCidadePageModule {}
