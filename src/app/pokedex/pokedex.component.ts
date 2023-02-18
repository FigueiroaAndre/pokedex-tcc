import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { GridViewComponent } from './ui/grid-view/grid-view.component';
import { PokeApiService } from '../shared/data-access/poke-api.service';
import { BehaviorSubject, last, map, Observable, scan, switchMap, tap } from 'rxjs';
import { Pokemon } from '../shared/models/pokemon.model';
import { ListResult } from '../shared/models/list-result.model';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [CommonModule, MatIconModule, GridViewComponent],
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss']
})
export class PokedexComponent {
  private currentPage$ = new BehaviorSubject<number>(0);
  protected pokemonListState$: Observable<ListResult<Pokemon>>;
  protected lastPage$: Observable<boolean>;

  constructor(private pokeApi: PokeApiService) {    

    this.pokemonListState$ = this.currentPage$.pipe(
      switchMap(page => this.pokeApi.getPokemonList(page)),
      scan(
        (acc, curr) => ({ last: curr.last , content: [...acc.content, ...curr.content]}),
        { last: false as boolean, content: [] as Pokemon[] }
      )
    );

    this.lastPage$ = this.pokemonListState$.pipe(map(listState => listState.last));
  }

  protected onLoadMorePokemon(): void {
    this.currentPage$.next(this.currentPage$.getValue() + 1);
  }

}
