import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, iif, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { ListResult } from '../models/list-result.model';
import { Pokemon } from '../models/pokemon.model';
import PokemonDataJson from './pokemon-data.json';

const PAGE_SIZE = 20;
const POKEMON_MAX_AMOUNT = 151;

@Injectable({
  providedIn: 'root'
})
export class PokeApiService {

  constructor(private http: HttpClient) { }

  getPokemonList(page: number = 0): Observable<ListResult<Pokemon>> {
    return of(PokemonDataJson as Pokemon[]).pipe(
      map<Pokemon[], ListResult<Pokemon>>(pokemonList => ({
        last: PAGE_SIZE * page + PAGE_SIZE >= POKEMON_MAX_AMOUNT,
        content: pokemonList.slice(PAGE_SIZE * page, PAGE_SIZE * page + PAGE_SIZE)
      })));
  }
}
