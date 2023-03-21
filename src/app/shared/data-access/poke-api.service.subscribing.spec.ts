import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { Subscription } from 'rxjs';
import { LIST_POKEMON_URL, PokeApiService } from './poke-api.service';

describe('PokeApiService (SUBSCRIBING)', () => {
  let service: PokeApiService;
  let httpTestingController: HttpTestingController;
  let subscription: Subscription | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    httpTestingController = TestBed.inject(HttpTestingController);
    service = TestBed.inject(PokeApiService);
    subscription = null;
  });

  afterEach(() => {
    subscription?.unsubscribe();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should perform a request to retrieve list of pokemons from API', () => {
    const page = 5;
    const searchText = 'Pikachu';
    subscription = service.getPokemonList(page, searchText).subscribe();

    const req = httpTestingController.match(request => request.url === LIST_POKEMON_URL)[0];

    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('page')).toBe(page.toString());
    expect(req.request.params.get('searchText')).toBe(searchText);
  })
});
