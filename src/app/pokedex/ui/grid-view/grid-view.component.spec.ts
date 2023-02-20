import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { HarnessLoader, } from '@angular/cdk/testing';
// import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCardHarness } from '@angular/material/card/testing';
import { GridViewComponent } from './grid-view.component';
import { createPokemonListMock } from 'src/app/tests/mocks/pokemon.mock';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { By } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

describe('GridViewComponent', () => {
  let component: GridViewComponent;
  let fixture: ComponentFixture<GridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ GridViewComponent ],
    })
    .overrideComponent(GridViewComponent, {
      set: {
        imports: [CommonModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(GridViewComponent);
    component = fixture.componentInstance;
  });

  it('should be able to render list of pokemon in cards', () => {
    component.pokemonList = createPokemonListMock(5);
    component.loadMoreVisible = true;

    fixture.detectChanges();

    const pokemonCards = fixture.debugElement.queryAll(By.css('mat-card'));

    expect(pokemonCards.length).toBe(5);
    pokemonCards.forEach((pokemonCard, index) => {
      const pokemonImage = pokemonCard.query(By.css('img'));
      const pokemonName = pokemonCard.query(By.css('p'));
      const pokemonTypeTag = pokemonCard.query(By.css('app-pokemon-type-tag'));
      expect(pokemonImage.attributes['src']).toBe(component.pokemonList[index].sprite);
      expect(pokemonName.nativeElement.innerText.toLowerCase()).toBe(component.pokemonList[index].name.toLowerCase());
      expect(pokemonTypeTag.properties['types']).toEqual(component.pokemonList[index].types);
    })
  });

  it('should be able to toggle visibility of load more button', () => {
    component.pokemonList = [];

    component.loadMoreVisible = true;
    fixture.detectChanges();
    let loadMoreButton = fixture.nativeElement.querySelector('.load-more-button');

    expect(loadMoreButton).toBeTruthy();

    component.loadMoreVisible = false;
    fixture.detectChanges();
    loadMoreButton = fixture.nativeElement.querySelector('.load-more-button');

    expect(loadMoreButton).toBeFalsy();
  });

  it('should emit loadMore event when load more button is clicked', () => {
    const loadMoreSpy = spyOn(component.loadMore, 'emit');
    component.pokemonList = [];
    component.loadMoreVisible = true;

    fixture.detectChanges();

    const loadMoreButton: HTMLButtonElement = fixture.nativeElement.querySelector('.load-more-button');
    loadMoreButton.click();

    expect(loadMoreSpy).toHaveBeenCalled();
  })
});
