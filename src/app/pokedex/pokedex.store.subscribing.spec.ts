import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { MatSnackBar } from "@angular/material/snack-bar";
import { of, Subscription } from "rxjs";
import { PokeApiService } from "../shared/data-access/poke-api.service";
import { RequestStatus } from "../shared/models/request-status.model";
import { createPokemonListMock } from "../tests/mocks/pokemon.mock";
import { PokedexState, PokedexStore } from "./pokedex.store";

const firstPageOfPokemonData = createPokemonListMock(20);
const secondPageOfPokemonData = createPokemonListMock(20, 21);

describe('PokedexStore (SUBSCRIBING)', () => {
  let service: PokedexStore;
  let subscription: Subscription | null;
  let pokeApiServiceSpy = jasmine.createSpyObj<PokeApiService>(['getPokemonList']);
  let matSnackBarSpy = jasmine.createSpyObj<MatSnackBar>(['open']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
      PokedexStore,
      {
        provide: PokeApiService,
        useValue: pokeApiServiceSpy
      },
      {
        provide: MatSnackBar,
        useValue: matSnackBarSpy
      }
    ]
    });
    subscription = null;
    pokeApiServiceSpy.getPokemonList.and.returnValue(of({ last: false, content: firstPageOfPokemonData }));
    pokeApiServiceSpy.getPokemonList.calls.reset();
  });

  afterEach(() => {
    subscription?.unsubscribe();
  });

  it('should be able to fetch first page of pokemons on initialization', () => {
    service = TestBed.inject(PokedexStore);
    const state$ = service.select(state => state);

    subscription = state$.subscribe(state => {
      expect(state.apiTrigger.currentPage).toBe(0);
      expect(state.apiTrigger.lastPage).toBe(false);
      expect(state.apiTrigger.searchText).toBe('');
      expect(state.pokemonList).toEqual(firstPageOfPokemonData);
    });
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalled();
  });

  it('should be able to fetch more pages of pokemons when calling loadNextPage when not in last page', () => {
    service = TestBed.inject(PokedexStore);
    pokeApiServiceSpy.getPokemonList.and.returnValue(of({ last: true, content: secondPageOfPokemonData }));
    const state$ = service.select(state => state);

    service.loadNextPage();

    subscription = state$.subscribe(state => {
      expect(state.apiTrigger.currentPage).toBe(1);
      expect(state.apiTrigger.lastPage).toBe(true);
      expect(state.apiTrigger.searchText).toBe('');
      expect(state.pokemonList).toEqual([...firstPageOfPokemonData, ...secondPageOfPokemonData]);
    });
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledTimes(2);
  });

  it('should not be able to fetch more pages of pokemons when calling loadNextPage when in last page', () => {
    pokeApiServiceSpy.getPokemonList.and.returnValue(of({ last: true, content: firstPageOfPokemonData }));
    service = TestBed.inject(PokedexStore);
    const state$ = service.select(state => state);

    service.loadNextPage();

    subscription = state$.subscribe(state => {
      expect(state.apiTrigger.currentPage).toBe(1);
      expect(state.apiTrigger.lastPage).toBe(true);
      expect(state.apiTrigger.searchText).toBe('');
      expect(state.pokemonList).toEqual([...firstPageOfPokemonData]);
    })
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledTimes(1);
  });

  it('should be able to fetch data by search text', () => {
    service = TestBed.inject(PokedexStore);
    const state$ = service.select(state => state);
    const searchStream$ = of('test1','test2','test3');

    service.searchPokemon(searchStream$);

    subscription = state$.subscribe(state => {
      expect(state.apiTrigger.currentPage).toBe(0);
      expect(state.apiTrigger.searchText).toBe('test3');
    });
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledTimes(4);
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledWith(0, 'test1');
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledWith(0, 'test2');
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledWith(0, 'test3');
  });

  it('should be able to retry last request using same parameters, but incrementing the retry count by 1', () => {
    service = TestBed.inject(PokedexStore);
    const emittedValues: any[] = []; // x
    const apiTrigger$ = service.select(state => state.apiTrigger);
    subscription = apiTrigger$.subscribe(state => {
      emittedValues.push(state);
    });
    
    service.searchPokemon('test1');
    pokeApiServiceSpy.getPokemonList.and.returnValue(of({ last: true, content: secondPageOfPokemonData }));
    service.loadNextPage();
    service.retryLastRequest();

    const currentValue = emittedValues.slice(-1)[0];
    const previousValue = emittedValues.slice(-2,-1)[0];
    expect(currentValue).toEqual({
      ...previousValue,
      requestRetryCount: previousValue.requestRetryCount + 1
    });
  });

  it('should be able to reset requestStatus to pending after 1 second', fakeAsync(() => {
    service = TestBed.inject(PokedexStore);
    const requestStatus = service.select(state => state.requestStatus);
    const emittedStatus: RequestStatus[] = [];
    subscription = requestStatus.subscribe(requestStatus => emittedStatus.push(requestStatus));

    expect(emittedStatus.length).toBe(1);
    tick(1000);
    expect(emittedStatus.length).toBe(2);
    expect(emittedStatus[0]).toBe('success');
    expect(emittedStatus[1]).toBe('pending');

  }));
});