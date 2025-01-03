import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

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
  declarations: [AdmsPage]
})
export class AdmsPageModule {}
