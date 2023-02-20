import { TestBed } from '@angular/core/testing';
import { cold, getTestScheduler } from 'jasmine-marbles';
import { TestScheduler } from 'rxjs/testing';
import { PAGE_SIZE, PokeApiService, POKEMON_MAX_AMOUNT } from './poke-api.service';
import PokemonDataJson from './pokemon-data.json';

describe('PokeApiService (MARBLE)', () => {
  let service: PokeApiService;
  let scheduler: TestScheduler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokeApiService);
    scheduler = getTestScheduler();
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
