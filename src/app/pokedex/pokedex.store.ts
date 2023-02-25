import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { concatMap, distinctUntilChanged, filter, map, Observable, tap } from "rxjs";
import { isEqual } from 'lodash-es';
import { PokeApiService } from "../shared/data-access/poke-api.service";
import { ListResult } from "../shared/models/list-result.model";
import { Pokemon } from "../shared/models/pokemon.model";

export interface PokedexState {
  pokemonList: Pokemon[];
  fetchData: PokeApiEffectData;
}

interface PokeApiEffectData {
  currentPage: number;
  lastPage: boolean;
  searchText: string;
};

@Injectable()
export class PokedexStore extends ComponentStore<PokedexState> {
  readonly pokemonList$ = this.select(state => state.pokemonList);
  private readonly fetchData$ = this.select(state => state.fetchData);
  readonly lastPage$ = this.fetchData$.pipe(map(data => data.lastPage));

  constructor(private readonly pokeApi: PokeApiService) {
    super({
      pokemonList: [],
      fetchData: {
        currentPage: 0,
        lastPage: false,
        searchText: ''
      }
    });
    this.fetchPokemons(this.fetchData$.pipe(distinctUntilChanged((a,b) => isEqual(a,b))));
  }

  readonly loadNextPage = this.updater(state => ({
    ...state,
    fetchData: {
      ...state.fetchData,
      currentPage: state.fetchData.currentPage + 1
    }
  }));

  readonly searchPokemon = this.updater((state, searchText: string) => ({
    pokemonList: [],
    fetchData: {
      currentPage: 0,
      lastPage: false,
      searchText: searchText
    }
  }));

  private readonly fetchPokemons = this.effect((data$: Observable<PokeApiEffectData>) => data$.pipe(
    filter(fetchData => !fetchData.lastPage),
    concatMap(fetchData => this.pokeApi.getPokemonList(fetchData.currentPage, fetchData.searchText)
      .pipe(tap(result => {
        if (fetchData.currentPage === 0) {
          this.setPokemonList(result);
        } else {
          this.addPokemonsToList(result);
        }
      }))),
  ));

  private addPokemonsToList = this.updater((state, pokemonListResult: ListResult<Pokemon>) => ({
    pokemonList: [...state.pokemonList, ...pokemonListResult.content],
    fetchData: {
      ...state.fetchData,
      lastPage: pokemonListResult.last
    }
  }));

  private setPokemonList = this.updater((state, pokemonListResult: ListResult<Pokemon>) => ({
    pokemonList: pokemonListResult.content,
    fetchData: {
      ...state.fetchData,
      lastPage: pokemonListResult.last
    }
  }));
  
}