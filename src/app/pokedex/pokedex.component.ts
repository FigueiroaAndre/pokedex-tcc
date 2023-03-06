import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GridViewComponent } from './ui/grid-view/grid-view.component';
import { PokedexStore } from './pokedex.store';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import { addPokemon, removePokemon } from '../shared/state/team/team.actions';
import { AppState } from '../shared/state/app.state';
import { Pokemon } from '../shared/models/pokemon.model';
import { selectTeam } from '../shared/state/team/team.selectors';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    GridViewComponent
  ],
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss'],
  providers: [PokedexStore]
})
export class PokedexComponent {
  protected lastPage$ = this.pokedexStore.lastPage$;
  protected pokemonList$ = this.pokedexStore.pokemonList$;
  protected searchControl = new FormControl('', { nonNullable: true });
  protected team$: Observable<Pokemon[]>;

  constructor(private readonly pokedexStore: PokedexStore, private readonly store: Store<AppState>) {
    const searchUpdateTrigger$ = this.searchControl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(500)
    );
    this.pokedexStore.searchPokemon(searchUpdateTrigger$);
    this.team$ = this.store.select(selectTeam);
  }

  protected onLoadMorePokemon(): void {
    this.pokedexStore.loadNextPage();
  }

  protected onAddPokemonToTeam(pokemon: Pokemon): void {
    this.store.dispatch(addPokemon({ pokemon}));
  }

  protected onRemovePokemonFromTeam(pokemon: Pokemon): void {
    this.store.dispatch(removePokemon({ id: pokemon.id }));
  }

}
