import { Injectable } from "@angular/core";
import { ComponentStore } from "@ngrx/component-store";
import { catchError, concatMap, delay, distinctUntilChanged, EMPTY, filter, map, Observable, tap } from "rxjs";
import { isEqual } from 'lodash-es';
import { PokeApiService } from "../shared/data-access/poke-api.service";
import { ListResult } from "../shared/models/list-result.model";
import { Pokemon } from "../shared/models/pokemon.model";
import { RequestStatus } from "../shared/models/request-status.model";
import { MatSnackBar } from "@angular/material/snack-bar";

export interface PokedexState {
  pokemonList: Pokemon[];
  requestStatus: RequestStatus;
  apiTrigger: ApiEffectTrigger;
}

interface ApiEffectTrigger {
  currentPage: number;
  lastPage: boolean;
  searchText: string;
  requestRetryCount: number;
};

@Injectable()
export class PokedexStore extends ComponentStore<PokedexState> {
  readonly pokemonList$ = this.select(state => state.pokemonList);
  readonly requestStatus$ = this.select(state => state.requestStatus);
  private readonly fetchData$ = this.select(state => state.apiTrigger);
  readonly lastPage$ = this.fetchData$.pipe(map(data => data.lastPage));

  constructor(
    private readonly pokeApi: PokeApiService,
    private readonly snackBar: MatSnackBar  
  ) {
    super({
      pokemonList: [],
      requestStatus: 'pending',
      apiTrigger: {
        requestRetryCount: 0,
        currentPage: 0,
        lastPage: false,
        searchText: ''
      }
    });
    this.fetchPokemons(this.fetchData$.pipe(distinctUntilChanged((a,b) => isEqual(a,b))));
  }

  readonly loadNextPage = this.updater(state => ({
    ...state,
    apiTrigger: {
      ...state.apiTrigger,
      requestRetryCount: 0,
      currentPage: state.apiTrigger.currentPage + 1
    }
  }));

  readonly searchPokemon = this.updater((state, searchText: string) => ({
    ...state,
    pokemonList: [],
    apiTrigger: {
      requestRetryCount: 0,
      currentPage: 0,
      lastPage: false,
      searchText: searchText
    }
  }));

  readonly retryLastRequest = this.updater(state => ({
    ...state,
    apiTrigger: {
      ...state.apiTrigger,
      requestRetryCount: state.apiTrigger.requestRetryCount + 1
    }
  }));

  private readonly fetchPokemons = this.effect((data$: Observable<ApiEffectTrigger>) => data$.pipe(
    filter(fetchData => !fetchData.lastPage),
    tap(() => this.updateRequestStatus('processing')),
    concatMap(fetchData => this.pokeApi.getPokemonList(fetchData.currentPage, fetchData.searchText)
      .pipe(
        tap({
          next: result => {
            if (fetchData.currentPage === 0) {
              this.setPokemonList(result);
            } else {
              this.addPokemonsToList(result);
            }
          },
          error: err => {
            this.snackBar.open(err.message, 'Dismiss', { horizontalPosition: 'end', verticalPosition: 'top'});
            this.updateRequestStatus('error');
          },
          finalize: () => this.resetRequestStatus()
        }),
        catchError(err => EMPTY)  
      )),
  ));

  private resetRequestStatus = this.effect($ => $.pipe(
    delay(1000),
    tap(() => this.updateRequestStatus('pending'))
  ));

  private updateRequestStatus = this.updater((state, requestStatus: RequestStatus) => ({
    ...state,
    requestStatus
  }));

  private addPokemonsToList = this.updater((state, pokemonListResult: ListResult<Pokemon>) => ({
    ...state,
    pokemonList: [...state.pokemonList, ...pokemonListResult.content],
    requestStatus: 'success',
    apiTrigger: {
      ...state.apiTrigger,
      lastPage: pokemonListResult.last
    }
  }));

  private setPokemonList = this.updater((state, pokemonListResult: ListResult<Pokemon>) => ({
    ...state,
    pokemonList: pokemonListResult.content,
    requestStatus: 'success',
    apiTrigger: {
      ...state.apiTrigger,
      lastPage: pokemonListResult.last
    }
  }));
  
}