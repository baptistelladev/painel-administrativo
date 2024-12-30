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
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'pessoas',
        loadChildren: () => import('./pessoas/pessoas.module').then( m => m.PessoasPageModule)
      },
      {
        path: 'usuarios',
        loadChildren: () => import('./usuarios/usuarios.module').then( m => m.UsuariosPageModule)
      },
      {
        path: 'lugares',
        children: [
          {
            path: '',
            loadChildren: () => import('./explorar/lugares/lugares.module').then( m => m.LugaresPageModule)
          },
          {
            path: 'na-cidade/:place_type',
            loadChildren: () => import('./explorar/features-cidade/lugar-na-cidade/lugar-na-cidade.module').then( m => m.LugarNaCidadePageModule)
          },
          {
            path: 'na-praia/:place_type',
            loadChildren: () => import('./explorar/features-praia/lugar-na-praia/lugar-na-praia.module').then( m => m.LugarNaPraiaPageModule)
          }
        ]
      },
      {
        path: 'cidades',
        loadChildren: () => import('./cidades/cidades.module').then( m => m.CidadesPageModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('./dashboard/dashboard.module').then( m => m.DashboardPageModule)
      },
      {
        path: 'sugestoes-do-anfitriao',
        children: [
          {
            path: '',
            loadChildren: () => import('./sugestoes-do-anfitriao/sugestoes/sugestoes.module').then( m => m.SugestoesPageModule)
          },
          {
            path: 'festival-de-comida-japonesa',
            loadChildren: () => import('./sugestoes-do-anfitriao/sugestoes-na-baixada-santista/festival-de-comida-japonesa/festival-de-comida-japonesa.module').then( m => m.FestivalDeComidaJaponesaPageModule)
          },
          {
            path: 'rua-gastronomica-de-santos',
            loadChildren: () => import('./sugestoes-do-anfitriao/sugestoes-na-baixada-santista/painel-rua-gastronomica/painel-rua-gastronomica.module').then( m => m.PainelRuaGastronomicaPageModule)
          }
        ]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TabsPageRoutingModule {}
