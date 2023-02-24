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
      expect(state.currentPage).toBe(0);
      expect(state.lastPage).toBe(false);
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
      expect(state.currentPage).toBe(1);
      expect(state.lastPage).toBe(true);
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
      expect(state.currentPage).toBe(1);
      expect(state.lastPage).toBe(true);
      expect(state.pokemonList).toEqual([...firstPageOfPokemonData]);
    })
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledTimes(1);
  });
});