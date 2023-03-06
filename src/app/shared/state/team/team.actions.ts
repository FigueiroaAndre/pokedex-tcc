import { createAction, props } from '@ngrx/store';
import { Pokemon } from '../../models/pokemon.model';

export const addPokemon = createAction('[Pokedex Component] Add to team', props<{ pokemon: Pokemon }>());
export const removePokemon = createAction('[Pokedex Component] Remove from team', props<{ id: number }>());
