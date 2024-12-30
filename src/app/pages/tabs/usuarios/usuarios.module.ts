import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { UsuariosPageRoutingModule } from './usuarios-routing.module';

import { UsuariosPage } from './usuarios.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { LottieComponent } from 'ngx-lottie';

@NgModule({
  imports: [
    SharedModule,
    ComponentsModule,
    UsuariosPageRoutingModule,
    LottieComponent
  ],
  declarations: [UsuariosPage],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UsuariosPageModule {}
