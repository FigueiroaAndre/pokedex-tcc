import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { BehaviorSubject, of } from 'rxjs';
import { createPokemonListMock } from '../tests/mocks/pokemon.mock';

import { PokedexComponent } from './pokedex.component';
import { PokedexStore } from './pokedex.store';

const pokemonListMock = createPokemonListMock();

describe('PokedexComponent', () => {
  let component: PokedexComponent;
  let fixture: ComponentFixture<PokedexComponent>;
  let lastPageMock = new BehaviorSubject<boolean>(false);
  let pokedexStoreSpy = jasmine.createSpyObj<PokedexStore>(['loadNextPage'],{
    lastPage$: lastPageMock.asObservable(),
    pokemonList$: of(pokemonListMock)
  });

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PokedexComponent ]
    })
    .overrideComponent(PokedexComponent, {
      set: {
        imports: [CommonModule],
        providers: [
          {
            provide: PokedexStore,
            useValue: pokedexStoreSpy
          }
        ],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokedexComponent);
    component = fixture.componentInstance;
    lastPageMock.next(false);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to render pokemon list', () => {
    const gridViewComponent = fixture.debugElement.query(By.css('app-grid-view'));

    expect(gridViewComponent.properties['pokemonList']).toEqual(pokemonListMock);
  });

  it('should be able to load next page of pokemons when loadMore event are triggered by GridViewComponent', () => {
    const gridViewComponent = fixture.debugElement.query(By.css('app-grid-view'));
    pokedexStoreSpy.loadNextPage.and.callFake(() => {});
    
    gridViewComponent.triggerEventHandler('loadMore');
    
    expect(pokedexStoreSpy.loadNextPage).toHaveBeenCalled();
  });

  it('should be able to toggle loadMoreVisible', () => {
    let gridViewComponent = fixture.debugElement.query(By.css('app-grid-view'));
    expect(gridViewComponent.properties['loadMoreVisible']).toBeTrue();

    lastPageMock.next(true);
    fixture.detectChanges();

    gridViewComponent = fixture.debugElement.query(By.css('app-grid-view'));
    expect(gridViewComponent.properties['loadMoreVisible']).toBeFalse();
  });

});
