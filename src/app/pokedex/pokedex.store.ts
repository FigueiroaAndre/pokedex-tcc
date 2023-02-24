import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { concatMap, distinctUntilChanged, filter, Observable, tap } from "rxjs";
import { PokeApiService } from "../shared/data-access/poke-api.service";
import { ListResult } from "../shared/models/list-result.model";
import { Pokemon } from "../shared/models/pokemon.model";

export interface PokedexState {
  pokemonList: Pokemon[];
  currentPage: number;
  lastPage: boolean;
}

@Injectable()
export class PokedexStore extends ComponentStore<PokedexState> {
  readonly pokemonList$ = this.select(state => state.pokemonList);
  readonly lastPage$ = this.select(state => state.lastPage);
  private readonly currentPage$ = this.select(state => state.currentPage);
  private readonly fetchPokemonsData$ = this.select({
    lastPage: this.lastPage$,
    currentPage: this.currentPage$
  }).pipe(distinctUntilChanged());

  constructor(private readonly pokeApi: PokeApiService) {
    super({
      pokemonList: [],
      currentPage: 0,
      lastPage: false
    });
    this.fetchPokemons(this.fetchPokemonsData$);
  }

  readonly fetchPokemons = this.effect((fetchData: Observable<{ lastPage: boolean, currentPage: number}>) => fetchData.pipe(
    filter(fetchData => !fetchData.lastPage),
    concatMap(fetchData => this.pokeApi.getPokemonList(fetchData.currentPage).pipe(tap(result => this.addPokemons(result)))),
  ));

  readonly loadNextPage = this.updater(state => {
    return {...state,
      currentPage: state.currentPage + 1}
      
  });

  private addPokemons = this.updater((state, pokemonListResult: ListResult<Pokemon>) => ({
    ...state,
    lastPage: pokemonListResult.last,
    pokemonList: [...state.pokemonList, ...pokemonListResult.content]
  }));
  
}