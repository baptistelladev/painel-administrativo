import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { UsuariosPageRoutingModule } from './usuarios-routing.module';

import { UsuariosPage } from './usuarios.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { LottieComponent } from 'ngx-lottie';
import { ComponentsModule } from 'src/app/shared/components/components.module';

@NgModule({
  imports: [
    SharedModule,
    UsuariosPageRoutingModule,
    LottieComponent,
    ComponentsModule
  ],
  declarations: [UsuariosPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsuariosPageModule {}
