import { Injectable } from '@angular/core';
import { map, Observable, of } from 'rxjs';
import { ListResult } from '../models/list-result.model';
import { Pokemon } from '../models/pokemon.model';
import PokemonDataJson from './pokemon-data.json';

export const PAGE_SIZE = 20;
export const POKEMON_MAX_AMOUNT = 151;

@Injectable({
  providedIn: 'root'
})
export class PokeApiService {

  getPokemonList(page: number = 0, searchText: string = ''): Observable<ListResult<Pokemon>> {
    return of(PokemonDataJson as Pokemon[]).pipe(
      map<Pokemon[], ListResult<Pokemon>>(pokemonList => {
        const filteredList = pokemonList.filter(pkm => pkm.name.toLowerCase().includes(searchText.toLowerCase()));
        const maxAmount = filteredList.length;
        return {
          last: PAGE_SIZE * page + PAGE_SIZE >= maxAmount,
          content: filteredList.slice(PAGE_SIZE * page, PAGE_SIZE * page + PAGE_SIZE)
        }
      }
    ));
  }
}
