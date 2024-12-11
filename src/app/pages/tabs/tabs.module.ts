import { SharedModule } from './../../shared/shared.module';
import { NgModule } from '@angular/core';
import { TabsPageRoutingModule } from './tabs-routing.module';

import { TabsPage } from './tabs.page';
import { ComponentsModule } from 'src/app/components/components.module';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule, // Importando o IonicModule para usar ion-router-outlet
    TabsPageRoutingModule,
    ReactiveFormsModule,
    ComponentsModule
  ],
  declarations: [TabsPage]
})
export class TabsPageModule {}
