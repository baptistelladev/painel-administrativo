import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { UsuariosPageRoutingModule } from './usuarios-routing.module';

import { UsuariosPage } from './usuarios.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/components/components.module';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    UsuariosPageRoutingModule
  ],
  declarations: [UsuariosPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsuariosPageModule {}
