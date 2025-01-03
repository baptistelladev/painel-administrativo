import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AdmsPage } from './adms.page';

const routes: Routes = [
  {
    path: '',
    component: AdmsPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdmsPageRoutingModule {}
