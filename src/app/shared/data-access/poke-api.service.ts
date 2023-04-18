import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ListResult } from '../models/list-result.model';
import { Pokemon } from '../models/pokemon.model';

export const LIST_POKEMON_URL = 'http://localhost:3000/pokemon';

@Injectable({
  providedIn: 'root'
})
export class PokeApiService {

  constructor(private http: HttpClient) {}

  getPokemonList(page: number = 0, searchText: string = ''): Observable<ListResult<Pokemon>> {
    return this.http.get<ListResult<Pokemon>>(LIST_POKEMON_URL, {
      params: {
        page,
        searchText
      }
    });
  }

}
