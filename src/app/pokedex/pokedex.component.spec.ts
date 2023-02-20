import { CommonModule } from '@angular/common';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { PokeApiService } from '../shared/data-access/poke-api.service';
import { createPokemonListMock } from '../tests/mocks/pokemon.mock';

import { PokedexComponent } from './pokedex.component';

const pageTestSize = 5;
const firstPageOfPokemonData = createPokemonListMock(pageTestSize);
const secondPageOfPokemonData = createPokemonListMock(pageTestSize, 1 + pageTestSize);

describe('PokedexComponent', () => {
  let component: PokedexComponent;
  let fixture: ComponentFixture<PokedexComponent>;
  let pokeApiServiceSpy = jasmine.createSpyObj<PokeApiService>(['getPokemonList']);

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ PokedexComponent ],
      providers: [
        {
          provide: PokeApiService,
          useValue: pokeApiServiceSpy
        }
      ]
    })
    .overrideComponent(PokedexComponent, {
      set: {
        imports: [CommonModule],
        schemas: [CUSTOM_ELEMENTS_SCHEMA]
      }
    })
    .compileComponents();

    fixture = TestBed.createComponent(PokedexComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    pokeApiServiceSpy.getPokemonList.and.returnValue(of({ last: false, content: firstPageOfPokemonData }));
    pokeApiServiceSpy.getPokemonList.calls.reset();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should be able to load the first page of pokemons', () => {
    const gridViewComponent = fixture.debugElement.query(By.css('app-grid-view'));

    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledWith(0);
    expect(gridViewComponent.properties['pokemonList']).toEqual(firstPageOfPokemonData);
  });

  it('should be able to load next page of pokemons when loadMore event are triggered by GridViewComponent', () => {
    const gridViewComponent = fixture.debugElement.query(By.css('app-grid-view'));
    pokeApiServiceSpy.getPokemonList.and.returnValue(of({ last: false, content: secondPageOfPokemonData }))
    
    gridViewComponent.triggerEventHandler('loadMore');
    fixture.detectChanges();
    
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledWith(0);
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledWith(1);
    expect(gridViewComponent.properties['pokemonList']).toEqual([...firstPageOfPokemonData, ...secondPageOfPokemonData]);
    expect(gridViewComponent.properties['loadMoreVisible']).toBeTrue();
  });

  it('should be able to detect last pages of data', () => {
    const gridViewComponent = fixture.debugElement.query(By.css('app-grid-view'));
    pokeApiServiceSpy.getPokemonList.and.returnValue(of({ last: true, content: secondPageOfPokemonData }));

    gridViewComponent.triggerEventHandler('loadMore');
    fixture.detectChanges();

    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledWith(0);
    expect(pokeApiServiceSpy.getPokemonList).toHaveBeenCalledWith(1);
    expect(gridViewComponent.properties['pokemonList']).toEqual([...firstPageOfPokemonData, ...secondPageOfPokemonData]);
    expect(gridViewComponent.properties['loadMoreVisible']).toBeFalse();
  });

});
