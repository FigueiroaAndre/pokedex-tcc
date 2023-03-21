import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { LIST_POKEMON_URL, PokeApiService } from './poke-api.service';

describe('PokeApiService (OBSERVER-SPY)', () => {
  let service: PokeApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(PokeApiService);
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform a request to retrieve list of pokemons from API', () => {
    const page = 5;
    const searchText = 'Pikachu';
    subscribeSpyTo(service.getPokemonList(page, searchText));

    const req = httpTestingController.match(request => request.url === LIST_POKEMON_URL)[0];

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe(page.toString());
    expect(req.request.params.get('searchText')).toBe(searchText);
  })
});
