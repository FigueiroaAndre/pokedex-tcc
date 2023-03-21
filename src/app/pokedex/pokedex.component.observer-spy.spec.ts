import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA, DebugElement } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { subscribeSpyTo } from '@hirez_io/observer-spy';
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import { Observable, of } from 'rxjs';
import { AppState } from '../shared/state/app.state';
import { addPokemon, removePokemon } from '../shared/state/team/team.actions';
import { createPokemonListMock, createPokemonMock } from '../tests/mocks/pokemon.mock';
import { dispatchNewInputValue } from '../tests/utils';

import { PokedexComponent } from './pokedex.component';
import { PokedexStore } from './pokedex.store';

const pokemonListMock = createPokemonListMock();

describe('PokedexComponent (OBSERVER-SPY)', () => {
  let component: PokedexComponent;
  let fixture: ComponentFixture<PokedexComponent>;
  let store: MockStore;
  let searchInput: HTMLInputElement;
  let searchTrigger$: Observable<string>;
  let pokedexStoreSpy = jasmine.createSpyObj<PokedexStore>(['loadNextPage', 'searchPokemon'],{
    lastPage$: of(false),
    pokemonList$: of(pokemonListMock),
    requestStatus$: of('pending')
  });
  let gridViewComponent: DebugElement;
  const initialState: AppState = {
    team: []
  };

  const typeInSearch = (value: string) => dispatchNewInputValue(fixture, searchInput, value); 

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PokedexComponent ],
      providers: [ provideMockStore({ initialState }) ]
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
  });
  
  beforeEach(() => {
    pokedexStoreSpy.searchPokemon.and.callFake(_ => of().subscribe());
    fixture.detectChanges();
    gridViewComponent = fixture.debugElement.query(By.css('app-grid-view'));
    searchInput = fixture.nativeElement.querySelector('.search-bar input');
    searchTrigger$ = pokedexStoreSpy.searchPokemon.calls.mostRecent().args[0] as Observable<string>;
  });

  it('should only trigger search if new text is different from last one', fakeAsync(() => {
    const searchTriggerSpy = subscribeSpyTo(searchTrigger$);

    typeInSearch('test1');
    tick(500);
    typeInSearch('test1');
    tick(500);
    typeInSearch('test2');
    tick(500);

    expect(searchTriggerSpy.getValues().length).toBe(2);
    expect(searchTriggerSpy.getValueAt(0)).toBe('test1');
    expect(searchTriggerSpy.getValueAt(1)).toBe('test2');
  }));

  it('should only trigger search when values have at least a 500ms time span', fakeAsync(() => {
    const searchTriggerSpy = subscribeSpyTo(searchTrigger$);

    typeInSearch('test');
    tick(500);
    typeInSearch('test1');
    tick(100);
    typeInSearch('test12');
    tick(499);
    typeInSearch('test123');
    tick(500);

    expect(searchTriggerSpy.getValues().length).toBe(2);
    expect(searchTriggerSpy.getValueAt(0)).toBe('test');
    expect(searchTriggerSpy.getValueAt(1)).toBe('test123');
  }));

  it('should dispatch addPokemon action when addPokemonToTeam event emits', () => {
    const pokemon = createPokemonMock();
    const expectedAction = addPokemon({ pokemon});
    const scannedActionsSpy = subscribeSpyTo(store.scannedActions$);

    gridViewComponent.triggerEventHandler('addPokemonToTeam', pokemon);

    expect(scannedActionsSpy.getLastValue()).toEqual(expectedAction);
  });

  it('should dispatch removePokemon action when removePokemonFromTeam event emits', () => {
    const pokemon = createPokemonMock();
    const expectedAction = removePokemon({ id: pokemon.id });
    const scannedActionsSpy = subscribeSpyTo(store.scannedActions$);

    gridViewComponent.triggerEventHandler('removePokemonFromTeam', pokemon);

    expect(scannedActionsSpy.getLastValue()).toEqual(expectedAction);
  });

});
