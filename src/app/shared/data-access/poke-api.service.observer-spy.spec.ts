import { TestBed } from '@angular/core/testing';
import { subscribeSpyTo, autoUnsubscribe } from '@hirez_io/observer-spy';
import { PAGE_SIZE, PokeApiService, POKEMON_MAX_AMOUNT } from './poke-api.service';
import PokemonDataJson from './pokemon-data.json';

describe('PokeApiService (OBSERVER-SPY)', () => {
  let service: PokeApiService;
  autoUnsubscribe();

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PokeApiService);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return observable with data retrieved from json file', () => {
    const getPokemonListSpy = subscribeSpyTo(service.getPokemonList());

    expect(getPokemonListSpy.getLastValue()).toEqual({
      last: PAGE_SIZE >= POKEMON_MAX_AMOUNT,
      content: PokemonDataJson.slice(0, PAGE_SIZE)
    })
  })
});
