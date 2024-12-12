import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExplorarPage } from './explorar.page';

const routes: Routes = [
  {
    path: '',
    component: ExplorarPage
  },
  {
    path: 'lugar-na-cidade',
    loadChildren: () => import('./features-cidade/lugar-na-cidade/lugar-na-cidade.module').then( m => m.LugarNaCidadePageModule)
  },
  {
    path: 'lugar-na-praia',
    loadChildren: () => import('./features-praia/lugar-na-praia/lugar-na-praia.module').then( m => m.LugarNaPraiaPageModule)
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ExplorarPageRoutingModule {}
