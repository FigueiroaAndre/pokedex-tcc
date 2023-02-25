import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { GridViewComponent } from './ui/grid-view/grid-view.component';
import { PokedexStore } from './pokedex.store';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';

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

  constructor(private readonly pokedexStore: PokedexStore) {
    const searchUpdateTrigger$ = this.searchControl.valueChanges.pipe(
      distinctUntilChanged(),
      debounceTime(500)
    );
    this.pokedexStore.searchPokemon(searchUpdateTrigger$);
  }

  protected onLoadMorePokemon(): void {
    this.pokedexStore.loadNextPage();
  }

}
