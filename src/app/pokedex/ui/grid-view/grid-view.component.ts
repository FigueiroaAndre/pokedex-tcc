import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { Pokemon } from 'src/app/shared/models/pokemon.model';
import { PokemonTypeTagComponent } from 'src/app/shared/ui/pokemon-type-tag/pokemon-type-tag.component';


@Component({
  selector: 'app-grid-view',
  standalone: true,
  imports: [CommonModule, MatCardModule, PokemonTypeTagComponent],
  templateUrl: './grid-view.component.html',
  styleUrls: ['./grid-view.component.scss']
})
export class GridViewComponent {
  @Input() pokemonList: Pokemon[];
}
