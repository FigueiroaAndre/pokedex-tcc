import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-pokedex-error-message',
  standalone: true,
  imports: [CommonModule, MatButtonModule],
  templateUrl: './pokedex-error-message.component.html',
  styleUrls: ['./pokedex-error-message.component.scss']
})
export class PokedexErrorMessageComponent {
  @Output() tryAgain = new EventEmitter<void>();

  protected onTryAgain(): void {
    this.tryAgain.emit();
  }
}
