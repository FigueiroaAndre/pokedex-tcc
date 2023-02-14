import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { GridViewComponent } from './ui/grid-view/grid-view.component';
import { PokeApiService } from '../shared/data-access/poke-api.service';
import { BehaviorSubject, combineLatest, forkJoin, map, Observable, switchMap } from 'rxjs';
import { Pokemon } from '../shared/models/pokemon.model';

@Component({
  selector: 'app-pokedex',
  standalone: true,
  imports: [CommonModule, MatIconModule, GridViewComponent],
  templateUrl: './pokedex.component.html',
  styleUrls: ['./pokedex.component.scss']
})
export class PokedexComponent {

  constructor(protected pokeApi: PokeApiService) {
  }
}
