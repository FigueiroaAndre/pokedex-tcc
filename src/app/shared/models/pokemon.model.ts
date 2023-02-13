import { PokemonType } from "./pokemon-type.model";

export interface Pokemon {
  id: number;
  name: string;
  sprite: string;
  types: PokemonType[];
}