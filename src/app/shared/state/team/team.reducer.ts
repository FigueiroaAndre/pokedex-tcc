import { createReducer, on } from "@ngrx/store";
import { Pokemon } from "../../models/pokemon.model";
import { addPokemon, removePokemon } from "./team.actions";

export const initialTeam: Pokemon[] = [];

export const teamReducer = createReducer(
  initialTeam,
  on(addPokemon, (state, { pokemon }) =>  {
    const isTeamComplete = state.length === 6;
    const isPokemonAlreadyInTheTeam = state.some(pkm => pkm.id === pokemon.id);

    return isTeamComplete || isPokemonAlreadyInTheTeam ? [...state] : [...state, pokemon];
  } ),
  on(removePokemon, (state, { id }) => state.filter(pokemon => pokemon.id !== id)),
);