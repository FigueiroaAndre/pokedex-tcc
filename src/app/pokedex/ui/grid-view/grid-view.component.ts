import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Pokemon } from 'src/app/shared/models/pokemon.model';
import { PokemonTypeTagComponent } from 'src/app/shared/ui/pokemon-type-tag/pokemon-type-tag.component';
import { MatButtonModule } from '@angular/material/button';


@Component({
  selector: 'app-grid-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, PokemonTypeTagComponent, MatButtonModule],
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.scss']
})
export class GridViewComponent {
  @Input() pokemonList: Pokemon[];
  @Input() loadMoreVisible: boolean;
  @Output() loadMore = new EventEmitter<void>();

  onLoadMoreClick(): void {
    this.loadMore.emit();
  }
}
