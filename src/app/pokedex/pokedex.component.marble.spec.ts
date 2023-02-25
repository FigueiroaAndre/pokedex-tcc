import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, fakeAsync, flush, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { getTestScheduler } from 'jasmine-marbles';
import { Observable, of, Subscription } from 'rxjs';
import { TestScheduler } from 'rxjs/testing';
import { createPokemonListMock } from '../tests/mocks/pokemon.mock';
import { dispatchNewInputValue } from '../tests/utils';

import { PokedexComponent } from './pokedex.component';
import { PokedexStore } from './pokedex.store';

const pokemonListMock = createPokemonListMock();

describe('PokedexComponent (MARBLE)', () => {
  let component: PokedexComponent;
  let fixture: ComponentFixture<PokedexComponent>;
  let subscription: Subscription;
  let scheduler: TestScheduler;
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
    scheduler = getTestScheduler();
  });
  
  beforeEach(() => {
    pokedexStoreSpy.searchPokemon.and.callFake(_ => of().subscribe());
    fixture.detectChanges();
    searchInput = fixture.nativeElement.querySelector('.search-bar input');
    searchTrigger$ = pokedexStoreSpy.searchPokemon.calls.mostRecent().args[0] as Observable<string>;
  });

  afterEach(() => {
    subscription?.unsubscribe();
  });

  it('should only trigger search if new text is different from last one', () => {
      const typingMarble =   '- a 500ms a 500ms b 500ms ';
      const expectedMarble = '- 500ms a - 500ms 500ms b ';
      const marbleValues = { a: 'test1', b: 'test2'};
      
      scheduler.run(({ cold, expectObservable }) => {
      const typingTrigger$ = cold(typingMarble, marbleValues);
      const expected$ = cold(expectedMarble, marbleValues);
      subscription = typingTrigger$.subscribe(text => typeInSearch(text));
      
      expectObservable(searchTrigger$).toEqual(expected$);
    });
  });

  it('should only trigger search when values have at least a 500ms time span', fakeAsync(() => {
    const typingMarble =   '- a 500ms b 100ms c 499ms d 500ms ';
    const expectedMarble = '- 500ms a 100ms - 499ms - 500ms d ';
    const marbleValues = { a: 'test', b: 'test1', c: 'test12', d: 'test123' };

    scheduler.run(({cold, expectObservable}) => {
      const typingTrigger$ = cold(typingMarble, marbleValues);
      const expected$ = cold(expectedMarble, marbleValues);
      subscription = typingTrigger$.subscribe(text => typeInSearch(text));
      
      expectObservable(searchTrigger$).toEqual(expected$);
    });
  }));

});
