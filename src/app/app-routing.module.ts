import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'painel-rua-gastronomica',
    pathMatch: 'full'
  },
  {
    path: 'painel-rua-gastronomica',
    loadChildren: () => import('./pages/painel-rua-gastronomica/painel-rua-gastronomica.module').then( m => m.PainelRuaGastronomicaPageModule)
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
