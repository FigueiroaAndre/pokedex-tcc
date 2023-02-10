import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { Constants } from '../shared/constants';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent {

    constructor(private router: Router) {}

    navigateToPokedex(): void {
        this.router.navigate([Constants.POKEDEX_URL])
    }
}
