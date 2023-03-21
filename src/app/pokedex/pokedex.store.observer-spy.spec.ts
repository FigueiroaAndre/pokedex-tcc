import { state } from "@angular/animations";
import { fakeAsync, TestBed, tick } from "@angular/core/testing";
import { MatSnackBar } from "@angular/material/snack-bar";
import { subscribeSpyTo } from "@hirez_io/observer-spy";
import { of } from "rxjs";
import { PokeApiService } from "../shared/data-access/poke-api.service";
import { createPokemonListMock } from "../tests/mocks/pokemon.mock";
import { PokedexStore } from "./pokedex.store";

const firstPageOfPokemonData = createPokemonListMock(20);
const secondPageOfPokemonData = createPokemonListMock(20, 21);

describe('PokedexStore (OBSERVER-SPY)', () => {
  let service: PokedexStore;
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
    pokeApiServiceSpy.getPokemonList.and.returnValue(of({ last: false, content: firstPageOfPokemonData }));
    pokeApiServiceSpy.getPokemonList.calls.reset();
  });

  it('should be able to fetch first page of pokemons on initialization', () => {
    service = TestBed.inject(PokedexStore);

    const stateSpy = subscribeSpyTo(service.select(state => state));

    expect(stateSpy.getLastValue()).toEqual({
      pokemonList: firstPageOfPokemonData,
      requestStatus: 'success',
      apiTrigger: {
        requestRetryCount: 0,
        currentPage: 0,
        lastPage: false,
        searchText: ''
      }
    });
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalled();
  });

  it('should be able to fetch more pages of pokemons when calling loadNextPage when not in last page', () => {
    service = TestBed.inject(PokedexStore);
    pokeApiServiceSpy.getPokemonList.and.returnValue(of({ last: true, content: secondPageOfPokemonData }));
    const stateSpy = subscribeSpyTo(service.select(state => state));

    service.loadNextPage();

    expect(stateSpy.getLastValue()).toEqual({
      pokemonList: [...firstPageOfPokemonData, ...secondPageOfPokemonData],
      requestStatus: 'success',
      apiTrigger: {
        requestRetryCount: 0,
        currentPage: 1,
        lastPage: true,
        searchText: ''
      }
    });
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledTimes(2);
  });

  it('should not be able to fetch more pages of pokemons when calling loadNextPage when in last page', () => {
    pokeApiServiceSpy.getPokemonList.and.returnValue(of({ last: true, content: firstPageOfPokemonData }));
    service = TestBed.inject(PokedexStore);
    const stateSpy = subscribeSpyTo(service.select(state => state));

    service.loadNextPage();

    expect(stateSpy.getLastValue()).toEqual({
      pokemonList: firstPageOfPokemonData,
      requestStatus: 'success',
      apiTrigger: {
        requestRetryCount: 0,
        currentPage: 1,
        lastPage: true,     
        searchText: ''
      }
    });
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledTimes(1);
  });

  it('should be able to fetch data by search text', () => {
    service = TestBed.inject(PokedexStore);
    const searchStream$ = of('test1','test2','test3');
    const stateSpy = subscribeSpyTo(service.select(state => state));

    service.searchPokemon(searchStream$);

    expect(stateSpy.getLastValue()?.apiTrigger.currentPage).toEqual(0);
    expect(stateSpy.getLastValue()?.apiTrigger.searchText).toEqual('test3');
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledTimes(4);
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledWith(0, 'test1');
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledWith(0, 'test2');
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledWith(0, 'test3');
  });

  it('should be able to retry last request using same parameters, but incrementing the retry count by 1', () => {
    service = TestBed.inject(PokedexStore);
    const apiTriggerSpy = subscribeSpyTo(service.select(state => state.apiTrigger));
    
    service.searchPokemon('test1');
    pokeApiServiceSpy.getPokemonList.and.returnValue(of({ last: true, content: secondPageOfPokemonData }));
    service.loadNextPage();
    service.retryLastRequest();

    const currentValue = apiTriggerSpy.getLastValue()!;
    const previousValue = apiTriggerSpy.getValueAt(apiTriggerSpy.getValuesLength() - 2);
    expect(currentValue).toEqual({
      ...previousValue,
      requestRetryCount: previousValue.requestRetryCount + 1
    });
  });

  it('should be able to reset requestStatus to pending after 1 second', fakeAsync(() => {
    service = TestBed.inject(PokedexStore);
    const requestStatusSpy = subscribeSpyTo(service.select(state => state.requestStatus));

    expect(requestStatusSpy.getValuesLength()).toBe(1);
    tick(1000);
    expect(requestStatusSpy.getValuesLength()).toBe(2);
    expect(requestStatusSpy.getValueAt(0)).toBe('success');
    expect(requestStatusSpy.getValueAt(1)).toBe('pending');
  }));
});