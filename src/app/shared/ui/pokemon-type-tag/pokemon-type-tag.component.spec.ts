import { ComponentFixture, TestBed } from '@angular/core/testing';
import { createPokemonTypeArray } from 'src/app/tests/mocks/pokemon-type.mock';

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
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should be able to style each type accordingly', () => {
    const typeNames = ['grass','fire'];
    const expectedTypeLabels = ['Grass', 'Fire'];
    component.types = createPokemonTypeArray(['grass','fire']);

    fixture.detectChanges();

    const styledDivTypes: HTMLDivElement[] = typeNames.map(name => fixture.nativeElement.querySelector(`.type-${name}`));
    styledDivTypes.forEach((div,index) => {
      expect(div.innerText).toBe(expectedTypeLabels[index]);
    })
  })
});
