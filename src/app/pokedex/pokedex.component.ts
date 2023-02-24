import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { GridViewComponent } from './ui/grid-view/grid-view.component';
import { PokedexStore } from './pokedex.store';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [CommonModule, MatIconModule, GridViewComponent],
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss'],
  providers: [PokedexStore]
})
export class PokedexComponent {
  protected lastPage$ = this.pokedexStore.lastPage$;
  protected pokemonList$ = this.pokedexStore.pokemonList$;

  constructor(private readonly pokedexStore: PokedexStore) {}

  protected onLoadMorePokemon(): void {
    this.pokedexStore.loadNextPage();
  }

}
