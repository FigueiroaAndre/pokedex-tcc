import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { Constants } from './shared/constants';

const routes: Routes = [
    { path: Constants.POKEDEX_ROUTE, loadComponent: () => import('./pokedex/pokedex.component').then(mod => mod.PokedexComponent) },
    { path: '', redirectTo: Constants.POKEDEX_ROUTE, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
