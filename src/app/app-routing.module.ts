import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const ROUTES = {
  POKEDEX_ROUTE: 'pokedex'
}

const routes: Routes = [
    { path: ROUTES.POKEDEX_ROUTE, loadComponent: () => import('./pokedex/pokedex.component').then(mod => mod.PokedexComponent) },
    { path: '', redirectTo: ROUTES.POKEDEX_ROUTE, pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
