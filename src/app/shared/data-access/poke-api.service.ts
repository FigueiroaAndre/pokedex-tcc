import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { ListResult } from '../models/list-result.model';
import { Pokemon } from '../models/pokemon.model';

export const PAGE_SIZE = 20;
export const POKEMON_MAX_AMOUNT = 151;

@Injectable({
  providedIn: 'root'
})
export class PokeApiService {

  constructor(private http: HttpClient) {}

  getPokemonList(page: number = 0, searchText: string = ''): Observable<ListResult<Pokemon>> {
    return this.http.get<ListResult<Pokemon>>('http://localhost:3000/pokemon', {
      params: {
        page,
        searchText
      }
    })
  }

}
