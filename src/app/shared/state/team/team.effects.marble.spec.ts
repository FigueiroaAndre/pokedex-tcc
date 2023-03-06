import { TestBed } from "@angular/core/testing";
import { provideMockActions } from "@ngrx/effects/testing";
import { Observable, Subscription } from "rxjs";
import { TeamEffects } from "./team.effects";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { AppState } from "../app.state";
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from "@angular/material/snack-bar";
import { TestColdObservable } from "jasmine-marbles/src/test-observables";
import { cold, getTestScheduler } from "jasmine-marbles";
import { createPokemonListMock, createPokemonMock } from "src/app/tests/mocks/pokemon.mock";
import { addPokemon } from "./team.actions";
import { TestScheduler } from "rxjs/testing";
import { ColdObservable } from "rxjs/internal/testing/ColdObservable";
import { Action } from "@ngrx/store";
import { Pokemon } from "../../models/pokemon.model";
import { TypedAction } from "@ngrx/store/src/models";

describe('Team Effects (MARBLE)', () => {
  let effects: TeamEffects;
  let actions$: ColdObservable<Action>;
  let store: MockStore;
  let subscription: Subscription | null;
  let scheduler: TestScheduler;
  let matSnackBarSpy = jasmine.createSpyObj<MatSnackBar>('MatSnackBar', ['open']);
  const initialState: AppState = {
    team: []
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        TeamEffects,
        provideMockActions(() => actions$),
        provideMockStore({ initialState }),
        {
          provide: MatSnackBar,
          useValue: matSnackBarSpy
        }
      ]
    });
    effects = TestBed.inject(TeamEffects);
    store = TestBed.inject(MockStore);
    scheduler = getTestScheduler();
    subscription = null;
    matSnackBarSpy.open.and.callFake(
      (message, actions, options) => jasmine.createSpyObj<MatSnackBarRef<TextOnlySnackBar>>('MatSnackbarRef', ['onAction'])
    );
    matSnackBarSpy.open.calls.reset();
  });

  afterEach(() => {
    subscription?.unsubscribe();
  })

  it('should open a snackbar if attempts to create a team with more than 6 pokemon', () => {
    const updateStateMarble = 'aa'
    const actionsMarble =     '----a';
    const expectedMarble =    '----a';
    const action = addPokemon({ pokemon: createPokemonMock() });

    scheduler.run(({ cold, expectObservable }) => {
      subscription = cold(updateStateMarble).subscribe(() => {
        store.setState({ team: createPokemonListMock(6, 1)});
      });

      actions$ = cold(actionsMarble, { a: action });

      const expected$: Observable<[{ pokemon: Pokemon} & TypedAction<'[Pokedex Component] Add to team'>, [Pokemon[] | never[], Pokemon[] | never[]]]> = cold(expectedMarble, {
        a: [action, [createPokemonListMock(6, 1), createPokemonListMock(6, 1)]]
      })

      expectObservable(effects.warnInvalidAddition$).toEqual(expected$);
    });
    
    expect(matSnackBarSpy.open).toHaveBeenCalled();
  });

  it('should not open a snackbar if attempts to create a team within the size limit', () => {
    const updateStateMarble = 'a'
    const actionsMarble =     '----a';
    const expectedMarble =    '----a';
    const action = addPokemon({ pokemon: createPokemonMock() });

    scheduler.run(({ cold, expectObservable }) => {
      subscription = cold(updateStateMarble).subscribe(() => {
        store.setState({ team: createPokemonListMock(1, 1)});
      });

      actions$ = cold(actionsMarble, { a: action });

      const expected$: Observable<[{ pokemon: Pokemon} & TypedAction<'[Pokedex Component] Add to team'>, [Pokemon[] | never[], Pokemon[] | never[]]]> = cold(expectedMarble, {
        a: [action, [[], createPokemonListMock(1, 1)]]
      })

      expectObservable(effects.warnInvalidAddition$).toEqual(expected$);
    });
    
    expect(matSnackBarSpy.open).not.toHaveBeenCalled();
  });
  
});