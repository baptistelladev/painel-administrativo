import { NgModule } from '@angular/core';
import { PessoasPageRoutingModule } from './pessoas-routing.module';
import { PessoasPage } from './pessoas.page';
import { SharedModule } from 'src/app/shared/shared.module';
import { ComponentsModule } from 'src/app/shared/components/components.module';

@NgModule({
  imports: [
    SharedModule,
    PessoasPageRoutingModule,
    ComponentsModule
  ],
  declarations: [PessoasPage]
})
export class PessoasPageModule {}
