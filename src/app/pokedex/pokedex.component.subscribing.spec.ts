import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, TestBed, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Observable, of, Subscription } from 'rxjs';
import { createPokemonListMock } from '../tests/mocks/pokemon.mock';
import { dispatchNewInputValue } from '../tests/utils';

import { PokedexComponent } from './pokedex.component';
import { PokedexStore } from './pokedex.store';

const pokemonListMock = createPokemonListMock();

describe('PokedexComponent (SUBSCRIBING)', () => {
  let component: PokedexComponent;
  let fixture: ComponentFixture<PokedexComponent>;
  let subscription: Subscription;
  let searchInput: HTMLInputElement;
  let searchTrigger$: Observable<string>;
  let pokedexStoreSpy = jasmine.createSpyObj<PokedexStore>(['loadNextPage', 'searchPokemon'],{
    lastPage$: of(false),
    pokemonList$: of(pokemonListMock)
  });

  const typeInSearch = (value: string) => dispatchNewInputValue(fixture, searchInput, value); 

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

  afterEach(() => {
    subscription?.unsubscribe();
  })

  it('should only trigger search if new text is different from last one', fakeAsync(() => {
    const emittedValues: string[] = [];
    subscription = searchTrigger$.subscribe(text => emittedValues.push(text));
      
      
    typeInSearch('test1');
    tick(500);
    typeInSearch('test1');
    tick(500);
    typeInSearch('test2');
    tick(500);

    expect(emittedValues.length).toBe(2);
    expect(emittedValues[0]).toBe('test1');
    expect(emittedValues[1]).toBe('test2');
  }));

  it('should only trigger search when values have at least a 500ms time span', fakeAsync(() => {
    const emittedValues: string[] = [];
    subscription = searchTrigger$.subscribe(text => emittedValues.push(text));

    typeInSearch('test');
    tick(500);
    typeInSearch('test1');
    tick(100);
    typeInSearch('test12');
    tick(499);
    typeInSearch('test123');
    tick(500);

    expect(emittedValues.length).toBe(2);
    expect(emittedValues[0]).toBe('test');
    expect(emittedValues[1]).toBe('test123');
  }));

});
