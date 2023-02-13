import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, iif, map, Observable, of, switchMap, take, tap } from 'rxjs';
import { Pokemon } from '../models/pokemon.model';
import PokemonDataJson from './pokemon-data.json';

@Injectable({
  providedIn: 'root'
})
export class PokeApiService {
  private _pokemonList = new BehaviorSubject<Pokemon[]>([])
  private _pokemonList$ = this._pokemonList.asObservable();

  constructor(private http: HttpClient) { }

  getPokemonList(): Observable<Pokemon[]> {
    return this._pokemonList$.pipe(
        switchMap(pokemonList => {
          return iif(
            () => pokemonList.length !== 0,
            this._pokemonList$.pipe(take(1)),
            of(PokemonDataJson as Pokemon[]).pipe(tap(pokemonList => this._pokemonList.next(pokemonList)))
          );
        })
    )
  }
}
