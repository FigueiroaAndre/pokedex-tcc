import { TestBed } from '@angular/core/testing';
import { Subscription } from 'rxjs';
import { PAGE_SIZE, PokeApiService, POKEMON_MAX_AMOUNT } from './poke-api.service';
import PokemonDataJson from './pokemon-data.json';

describe('PokeApiService (SUBSCRIBING)', () => {
  let service: PokeApiService;
  let subscription: Subscription | null;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokeApiService);
    subscription = null;
  });

  afterEach(() => {
    subscription?.unsubscribe();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return observable with data retrieved from json file', () => {
    subscription = service.getPokemonList().subscribe(pokemonList => {
      expect(pokemonList).toEqual({
        last: PAGE_SIZE >= POKEMON_MAX_AMOUNT,
        content: PokemonDataJson.slice(0, PAGE_SIZE)
      })
    });
  })
});
