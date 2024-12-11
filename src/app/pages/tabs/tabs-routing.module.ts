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
        loadChildren: () => import('./sugestoes-do-anfitriao/sugestoes-na-baixada-santista/painel-rua-gastronomica/painel-rua-gastronomica.module').then( m => m.PainelRuaGastronomicaPageModule)
      },
      {
        path: 'lugares',
        loadChildren: () => import('./explorar/lugares/lugares.module').then( m => m.LugaresPageModule)
      },
      {
        path: 'pessoas',
        loadChildren: () => import('./explorar/pessoas/pessoas.module').then( m => m.PessoasPageModule)
      },
      {
        path: 'cidades',
        loadChildren: () => import('./cidades/cidades.module').then( m => m.CidadesPageModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
