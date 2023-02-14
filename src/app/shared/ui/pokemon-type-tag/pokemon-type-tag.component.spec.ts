import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PokemonTypeTagComponent } from './pokemon-type-tag.component';

describe('PokemonTypeTagComponent', () => {
  let component: PokemonTypeTagComponent;
  let fixture: ComponentFixture<PokemonTypeTagComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PokemonTypeTagComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokemonTypeTagComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
