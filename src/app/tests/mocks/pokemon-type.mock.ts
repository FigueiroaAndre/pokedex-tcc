import { PokemonType } from "src/app/shared/models/pokemon-type.model";

export function createPokemonTypeArray(typeNames: string[]): PokemonType[] {
  return typeNames.map(typeName => ({ name: typeName }));
}