import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Pokemon } from 'src/app/shared/models/pokemon.model';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-team-miniature',
  standalone: true,
  imports: [CommonModule, MatCardModule],
  templateUrl: './team-miniature.component.html',
  styleUrls: ['./team-miniature.component.scss']
})
export class TeamMiniatureComponent {
  @Input() team: Pokemon[];
  
  miniatureTeamArray(): (Pokemon | null)[] {
    return [...this.team, ...Array(6 - this.team.length).fill(null)];
  }

  
}
