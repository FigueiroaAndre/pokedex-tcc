import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PokemonType } from '../../models/pokemon-type.model';

@Component({
  selector: 'app-pokemon-type-tag',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './pokemon-type-tag.component.html',
  styleUrls: ['./pokemon-type-tag.component.scss']
})
export class PokemonTypeTagComponent {
  @Input() types: PokemonType[];
}
