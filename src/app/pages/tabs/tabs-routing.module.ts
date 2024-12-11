import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: '',
        redirectTo: 'painel-rua-gastronomica',
        pathMatch: 'full'
      },
      {
        path: 'painel-rua-gastronomica',
        loadChildren: () => import('./painel-rua-gastronomica/painel-rua-gastronomica.module').then( m => m.PainelRuaGastronomicaPageModule)
      },
      {
        path: 'lugares',
        loadChildren: () => import('./lugares/lugares.module').then( m => m.LugaresPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
