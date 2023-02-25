import { TestBed } from "@angular/core/testing";
import { of, Subscription } from "rxjs";
import { PokeApiService } from "../shared/data-access/poke-api.service";
import { createPokemonListMock } from "../tests/mocks/pokemon.mock";
import { PokedexStore } from "./pokedex.store";

const firstPageOfPokemonData = createPokemonListMock(20);
const secondPageOfPokemonData = createPokemonListMock(20, 21);

describe('PokedexStore (SUBSCRIBING)', () => {
  let service: PokedexStore;
  let subscription: Subscription;
  let pokeApiServiceSpy = jasmine.createSpyObj<PokeApiService>(['getPokemonList']);

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
      PokedexStore,
      {
        provide: PokeApiService,
        useValue: pokeApiServiceSpy
      }]
    });
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
      expect(state.fetchData.currentPage).toBe(0);
      expect(state.fetchData.lastPage).toBe(false);
      expect(state.fetchData.searchText).toBe('');
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
      expect(state.fetchData.currentPage).toBe(1);
      expect(state.fetchData.lastPage).toBe(true);
      expect(state.fetchData.searchText).toBe('');
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
      expect(state.fetchData.currentPage).toBe(1);
      expect(state.fetchData.lastPage).toBe(true);
      expect(state.fetchData.searchText).toBe('');
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
      expect(state.fetchData.currentPage).toBe(0);
      expect(state.fetchData.searchText).toBe('test3');
    });
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledTimes(4);
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledWith(0, 'test1');
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledWith(0, 'test2');
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledWith(0, 'test3');
  });
});