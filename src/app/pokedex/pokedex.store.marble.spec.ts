import { TestBed } from "@angular/core/testing";
import { MatSnackBar } from "@angular/material/snack-bar";
import { cold } from "jasmine-marbles";
import { Subscription } from "rxjs";
import { PokeApiService } from "../shared/data-access/poke-api.service";
import { createPokemonListMock } from "../tests/mocks/pokemon.mock";
import { PokedexStore } from "./pokedex.store";

const firstPageOfPokemonData = createPokemonListMock(1);
const secondPageOfPokemonData = createPokemonListMock(20, 21);

describe('PokedexStore (MARBLE)', () => {
  let service: PokedexStore;
  let pokeApiServiceSpy = jasmine.createSpyObj<PokeApiService>(['getPokemonList']);
  let subscription: Subscription | null;
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
  });

  beforeEach(() => {
    pokeApiServiceSpy.getPokemonList.calls.reset();
    subscription = null;
  })


  afterEach(() => {
    subscription?.unsubscribe();
  });
  
  it('should be able to fetch first page of pokemons on initialization', () => {
    const requestMarble = '--a|';
    const resultMarble =  'a-b';

    pokeApiServiceSpy.getPokemonList.and.returnValue(cold(requestMarble, { a: { last: false, content: firstPageOfPokemonData }}));
    service = TestBed.inject(PokedexStore);

    const state$ = service.select(state => state);
    const expectedState$ = cold(resultMarble, {
      a: { pokemonList: [], requestStatus: 'processing', apiTrigger: { requestRetryCount: 0, currentPage: 0, lastPage: false, searchText: '' }},
      b: { pokemonList: firstPageOfPokemonData, requestStatus: 'success' , apiTrigger: { requestRetryCount: 0, currentPage: 0, lastPage: false, searchText: '' }}
    });

    expect(state$).toBeObservable(expectedState$);
  });

  it('should be able to fetch more pages of pokemons when calling loadNextPage when not in last page', () => {
    const requestMarble =       '-----a|';
    const triggerEffectMarble = '--------a'
    //                                   -----a| From second request
    const resultMarble =        'a----b--(cd)-e';


    pokeApiServiceSpy.getPokemonList.and.returnValue(cold(requestMarble, { a: { last: false, content: firstPageOfPokemonData }}));
    service = TestBed.inject(PokedexStore);
    pokeApiServiceSpy.getPokemonList.and.returnValue(cold(requestMarble, { a: { last: true, content: secondPageOfPokemonData }}));

    const state$ = service.select(state => state);
    const loadNextTrigger$ = cold(triggerEffectMarble);
    subscription = loadNextTrigger$.subscribe(_ => service.loadNextPage());     
    const expectedState$ = cold(resultMarble, {
      a: { pokemonList: [], requestStatus: 'processing', apiTrigger: { requestRetryCount: 0, currentPage: 0, lastPage: false, searchText: ''  }},
      b: { pokemonList: firstPageOfPokemonData, requestStatus: 'success', apiTrigger: { requestRetryCount: 0, currentPage: 0, lastPage: false, searchText: '' }},
      c: { pokemonList: firstPageOfPokemonData, requestStatus: 'success', apiTrigger: { requestRetryCount: 0, currentPage: 1, lastPage: false, searchText: '' }},
      d: { pokemonList: firstPageOfPokemonData, requestStatus: 'processing', apiTrigger: { requestRetryCount: 0, currentPage: 1, lastPage: false, searchText: '' }},
      e: { pokemonList: [...firstPageOfPokemonData, ...secondPageOfPokemonData], requestStatus: 'success', apiTrigger: { requestRetryCount: 0, currentPage: 1, lastPage: true, searchText: ''} }
    });

    expect(state$).toBeObservable(expectedState$);
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledTimes(2);
  });

  it('should not be able to fetch more pages of pokemons when calling loadNextPage when in last page', () => {
    const requestMarble =       '--a|';
    const triggerEffectMarble = '-----a';
    const resultMarble =        'a-b--c';


    pokeApiServiceSpy.getPokemonList.and.returnValue(cold(requestMarble, { a: { last: true, content: firstPageOfPokemonData} }));
    service = TestBed.inject(PokedexStore);

    const state$ = service.select(state => state);
    const loadNextTrigger$ = cold(triggerEffectMarble);
    subscription = loadNextTrigger$.subscribe(x => service.loadNextPage());
    const expectedState$ = cold(resultMarble, {
      a: { pokemonList: [], requestStatus: 'processing', apiTrigger: { requestRetryCount: 0, currentPage: 0, lastPage: false, searchText: '' }},
      b: { pokemonList: firstPageOfPokemonData, requestStatus: 'success', apiTrigger: { requestRetryCount: 0, currentPage: 0, lastPage: true, searchText: '' }},
      c: { pokemonList: firstPageOfPokemonData, requestStatus: 'success', apiTrigger: { requestRetryCount: 0, currentPage: 1, lastPage: true, searchText: '' }}
    });

    expect(state$).toBeObservable(expectedState$);
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledTimes(1);
  });

  it('should be able to fetch data by search text', () => {
    const requestMarble = '-----a|';
    const searchMarble =  '----------a--------b';
    //                     -----x    -----x   -----x (requests)
    const resultMarble =  'a----b----(cd)-e---(fg)-h';

    pokeApiServiceSpy.getPokemonList.and.returnValue(cold(requestMarble, { a: { last: false, content: firstPageOfPokemonData} }));
    service = TestBed.inject(PokedexStore);
    
    const state$ = service.select(state => state);
    const searchStream$ = cold(searchMarble, { a: 'test1', b: 'test2' }); 
    const expectedState$ = cold(resultMarble, {
      a: { pokemonList: [], requestStatus: 'processing', apiTrigger: { requestRetryCount: 0, currentPage: 0, lastPage: false, searchText: '' }},
      b: { pokemonList: firstPageOfPokemonData, requestStatus: 'success', apiTrigger: {requestRetryCount: 0, currentPage: 0, lastPage: false, searchText: '' }},
      c: { pokemonList: [], requestStatus: 'success', apiTrigger: { requestRetryCount: 0, currentPage: 0, lastPage: false, searchText: 'test1' }},
      d: { pokemonList: [], requestStatus: 'processing', apiTrigger: { requestRetryCount: 0, currentPage: 0, lastPage: false, searchText: 'test1' }},
      e: { pokemonList: firstPageOfPokemonData, requestStatus: 'success', apiTrigger: { requestRetryCount: 0, currentPage: 0, lastPage: false, searchText: 'test1' }},
      f: { pokemonList: [], requestStatus: 'success', apiTrigger: { requestRetryCount: 0, currentPage: 0, lastPage: false, searchText: 'test2' }},
      g: { pokemonList: [], requestStatus: 'processing', apiTrigger: { requestRetryCount: 0, currentPage: 0, lastPage: false, searchText: 'test2' }},
      h: { pokemonList: firstPageOfPokemonData, requestStatus: 'success', apiTrigger: { requestRetryCount: 0, currentPage: 0, lastPage: false, searchText: 'test2' }},
    });
    
    service.searchPokemon(searchStream$)

    expect(state$).toBeObservable(expectedState$);
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledTimes(3);
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledWith(0, 'test1');
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledWith(0, 'test2');
  });
});