import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Pokemon } from 'src/app/shared/models/pokemon.model';
import { PokemonTypeTagComponent } from 'src/app/shared/ui/pokemon-type-tag/pokemon-type-tag.component';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';


@Component({
  selector: 'app-grid-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, PokemonTypeTagComponent, MatButtonModule, MatIconModule],
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.scss']
})
export class GridViewComponent {
  @Input() pokemonList: Pokemon[];
  @Input() team: Pokemon[];
  @Input() loadMoreVisible: boolean;
  @Output() loadMore = new EventEmitter<void>();
  @Output() addPokemonToTeam = new EventEmitter<Pokemon>();
  @Output() removePokemonFromTeam = new EventEmitter<Pokemon>();

  protected onLoadMoreClick(): void {
    this.loadMore.emit();
  }

  protected onAddClick(pokemon: Pokemon): void {
    this.addPokemonToTeam.emit(pokemon);
  }

  protected onRemoveClick(pokemon: Pokemon): void {
    this.removePokemonFromTeam.emit(pokemon);
  }

  protected isPokemonInTeam(pokemon: Pokemon): boolean {
    return this.team.some(pkm => pkm.id === pokemon.id);
  }
}
