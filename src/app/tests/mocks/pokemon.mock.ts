import { PokemonType } from "src/app/shared/models/pokemon-type.model";
import { Pokemon } from "src/app/shared/models/pokemon.model";
import { createPokemonTypeArray } from "./pokemon-type.mock";

export function createPokemonMock(id: number = 1, types: PokemonType[] = createPokemonTypeArray(['grass'])): Pokemon {
  return {
    id,
    name: `Pokemon${id}`,
    sprite: `https://fakeurl.com/pokemon${id}.svg`,
    types
  }
}

export function createPokemonListMock(amount: number = 20, startFrom: number = 1): Pokemon[] {
  return Array(amount)
    .fill(1)
    .map((_,index) => createPokemonMock(index + startFrom));
}
