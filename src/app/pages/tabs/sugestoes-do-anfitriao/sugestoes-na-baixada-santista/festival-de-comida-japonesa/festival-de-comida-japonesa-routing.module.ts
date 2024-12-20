import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { FestivalDeComidaJaponesaPage } from './festival-de-comida-japonesa.page';

const routes: Routes = [
  {
    path: '',
    component: FestivalDeComidaJaponesaPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FestivalDeComidaJaponesaPageRoutingModule {}
