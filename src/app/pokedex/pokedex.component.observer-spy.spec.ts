import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { autoUnsubscribe, subscribeSpyTo } from '@hirez_io/observer-spy';
import { Observable, of } from 'rxjs';
import { createPokemonListMock } from '../tests/mocks/pokemon.mock';
import { dispatchNewInputValue } from '../tests/utils';

import { PokedexComponent } from './pokedex.component';
import { PokedexStore } from './pokedex.store';

const pokemonListMock = createPokemonListMock();

describe('PokedexComponent (OBSERVER-SPY)', () => {
  let component: PokedexComponent;
  let fixture: ComponentFixture<PokedexComponent>;
  let searchInput: HTMLInputElement;
  let searchTrigger$: Observable<string>;
  let pokedexStoreSpy = jasmine.createSpyObj<PokedexStore>(['loadNextPage', 'searchPokemon'],{
    lastPage$: of(false),
    pokemonList$: of(pokemonListMock)
  });

  const typeInSearch = (value: string) => dispatchNewInputValue(fixture, searchInput, value); 

  autoUnsubscribe();

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PokedexComponent ]
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
  });
  
  beforeEach(() => {
    pokedexStoreSpy.searchPokemon.and.callFake(_ => of().subscribe());
    fixture.detectChanges();
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

});
