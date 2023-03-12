import { TestBed } from "@angular/core/testing";
import { MatSnackBar } from "@angular/material/snack-bar";
import { autoUnsubscribe, subscribeSpyTo } from "@hirez_io/observer-spy";
import { of, Subscription } from "rxjs";
import { PokeApiService } from "../shared/data-access/poke-api.service";
import { createPokemonListMock } from "../tests/mocks/pokemon.mock";
import { PokedexStore } from "./pokedex.store";

const firstPageOfPokemonData = createPokemonListMock(20);
const secondPageOfPokemonData = createPokemonListMock(20, 21);

describe('PokedexStore (OBSERVER-SPY)', () => {
  let service: PokedexStore;
  let pokeApiServiceSpy = jasmine.createSpyObj<PokeApiService>(['getPokemonList']);
  let matSnackBarSpy = jasmine.createSpyObj<MatSnackBar>(['open']);

  autoUnsubscribe();

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
});