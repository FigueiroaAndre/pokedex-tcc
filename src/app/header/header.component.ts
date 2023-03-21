import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ROUTES } from '../app-routing.module';
import { TeamMiniatureComponent } from './ui/team-miniature/team-miniature.component';
import { AppState } from '../shared/state/app.state';
import { Pokemon } from '../shared/models/pokemon.model';
import { selectTeam } from '../shared/state/team/team.selectors';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, TeamMiniatureComponent],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {
  protected team$: Observable<Pokemon[]>;

  constructor(private store: Store<AppState>) {
    this.team$ = this.store.select(selectTeam);
  }

}
