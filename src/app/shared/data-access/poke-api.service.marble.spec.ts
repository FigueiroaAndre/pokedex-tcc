import { TestBed } from '@angular/core/testing';
import { cold } from 'jasmine-marbles';
import { PAGE_SIZE, PokeApiService, POKEMON_MAX_AMOUNT } from './poke-api.service';
import PokemonDataJson from './pokemon-data.json';

describe('PokeApiService (MARBLE)', () => {
  let service: PokeApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokeApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return observable with data retrieved from json file', () => {
    const expected$ = cold('(a|)', { a: {
      last: PAGE_SIZE >= POKEMON_MAX_AMOUNT,
      content: PokemonDataJson.slice(0, PAGE_SIZE)
    } });

    expect(service.getPokemonList()).toBeObservable(expected$);
  })
});
