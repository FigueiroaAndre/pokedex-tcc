import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { BehaviorSubject, of } from 'rxjs';
import { AppState } from '../shared/state/app.state';
import { createPokemonListMock, createPokemonMock } from '../tests/mocks/pokemon.mock';

import { PokedexComponent } from './pokedex.component';
import { PokedexStore } from './pokedex.store';

const pokemonListMock = createPokemonListMock();
const teamMock = createPokemonListMock(3,1);

describe('PokedexComponent', () => {
  let component: PokedexComponent;
  let fixture: ComponentFixture<PokedexComponent>;
  let store: MockStore;
  let lastPageMock = new BehaviorSubject<boolean>(false);
  let pokedexStoreSpy = jasmine.createSpyObj<PokedexStore>(['loadNextPage', 'searchPokemon'],{
    lastPage$: lastPageMock.asObservable(),
    pokemonList$: of(pokemonListMock)
  });
  let gridViewComponent: DebugElement;
  const initialState: AppState = {
    team: teamMock
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PokedexComponent ],
      providers: [ provideMockStore({ initialState })]
    })
    .overrideComponent(PokedexComponent, {
      set: {
        imports: [CommonModule, ReactiveFormsModule],
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
    store = TestBed.inject(MockStore);
    lastPageMock.next(false);
    fixture.detectChanges();
    gridViewComponent = fixture.debugElement.query(By.css('app-grid-view'));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to render pokemon list', () => {
    expect(gridViewComponent.properties['pokemonList']).toEqual(pokemonListMock);
  });

  it('should be able to load next page of pokemons when loadMore event are triggered by GridViewComponent', () => {
    pokedexStoreSpy.loadNextPage.and.callFake(() => {});
    
    gridViewComponent.triggerEventHandler('loadMore');
    
    expect(pokedexStoreSpy.loadNextPage).toHaveBeenCalled();
  });

  it('should be able to toggle loadMoreVisible', () => {
    expect(gridViewComponent.properties['loadMoreVisible']).toBeTrue();

    lastPageMock.next(true);
    fixture.detectChanges();

    gridViewComponent = fixture.debugElement.query(By.css('app-grid-view'));
    expect(gridViewComponent.properties['loadMoreVisible']).toBeFalse();
  });

  it('should be able to load team from store', () => {
    expect(gridViewComponent.properties['team']).toEqual(teamMock);
  });

});
