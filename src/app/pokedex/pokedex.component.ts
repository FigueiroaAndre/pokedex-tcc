import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GridViewComponent } from './ui/grid-view/grid-view.component';
import { PokedexStore } from './pokedex.store';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { combineLatest, debounceTime, distinctUntilChanged, filter, map, Observable, startWith } from 'rxjs';
import { Store } from '@ngrx/store';
import { addPokemon, removePokemon } from '../shared/state/team/team.actions';
import { AppState } from '../shared/state/app.state';
import { Pokemon } from '../shared/models/pokemon.model';
import { selectTeam } from '../shared/state/team/team.selectors';
import { LoaderComponent } from '../shared/ui/loader/loader.component';
import { PokedexErrorMessageComponent } from './ui/pokedex-error-message/pokedex-error-message.component';

interface ViewModel {
  lastPage: boolean;
  pokemonList: Pokemon[];
  hasLastRequestFailed: boolean;
  isLoading: boolean;
  team: Pokemon[];
}

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    GridViewComponent,
    LoaderComponent,
    PokedexErrorMessageComponent
  ],
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss'],
  providers: [PokedexStore]
})
export class PokedexComponent {
  private lastPage$ = this.pokedexStore.lastPage$;
  private pokemonList$ = this.pokedexStore.pokemonList$;
  private isLoading$ = this.pokedexStore.requestStatus$.pipe(map(requestStatus => requestStatus === 'processing'));
  private hasLastRequestFailed$ = this.pokedexStore.requestStatus$.pipe(
    filter(requestStatus => requestStatus === 'success' || requestStatus === 'error'),
    map(requestStatus => requestStatus === 'error')
  );
  private team$: Observable<Pokemon[]>;

  protected searchControl = new FormControl('', { nonNullable: true });
  protected vm$: Observable<ViewModel>;

  constructor(private readonly pokedexStore: PokedexStore, private readonly store: Store<AppState>) {
    const searchUpdateTrigger$ = this.searchControl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(500)
    );
    this.pokedexStore.searchPokemon(searchUpdateTrigger$);
    this.team$ = this.store.select(selectTeam);
    this.vm$ = combineLatest({
      isLoading: this.isLoading$.pipe(startWith(false)),
      hasLastRequestFailed: this.hasLastRequestFailed$.pipe(startWith(false)),
      lastPage: this.lastPage$.pipe(startWith(false)),
      pokemonList: this.pokemonList$.pipe(startWith([])),
      team: this.team$.pipe(startWith([]))
    });
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

  protected onTryAgain(): void {
    this.pokedexStore.retryLastRequest();
  }

}
