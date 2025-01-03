import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { LugaresPageRoutingModule } from './lugares-routing.module';

import { LugaresPage } from './lugares.page';
import { ComponentsModule } from 'src/app/shared/components/components.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    LugaresPageRoutingModule,
    ComponentsModule
  ],
  declarations: [LugaresPage]
})
export class LugaresPageModule {}
