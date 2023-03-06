import { TestBed } from "@angular/core/testing";
import { Action } from "@ngrx/store";
import { provideMockActions } from "@ngrx/effects/testing";
import { BehaviorSubject, Observable, of, pairwise, startWith, Subscription } from "rxjs";
import { TeamEffects } from "./team.effects";
import { createPokemonListMock, createPokemonMock } from "src/app/tests/mocks/pokemon.mock";
import { MockStore, provideMockStore } from "@ngrx/store/testing";
import { AppState } from "../app.state";
import { MatSnackBar, MatSnackBarRef, TextOnlySnackBar } from "@angular/material/snack-bar";
import { addPokemon } from "./team.actions";
import { INITIAL_ACTION } from "src/app/tests/utils";

describe('Team Effects (SUBSCRIBING)', () => {
  let effects: TeamEffects;
  let actions$ = new BehaviorSubject<Action>(INITIAL_ACTION);
  let store: MockStore;
  let subscription: Subscription | null;
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
    actions$.next(INITIAL_ACTION);
    effects = TestBed.inject(TeamEffects);
    store = TestBed.inject(MockStore);
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
    subscription = effects.warnInvalidAddition$.subscribe();

    store.setState({
      team: createPokemonListMock(6, 1) 
    });
    store.setState({
      team: createPokemonListMock(6, 1) 
    });

    actions$.next(addPokemon({ pokemon: createPokemonMock() }));

    expect(matSnackBarSpy.open).toHaveBeenCalled();
  });

  it('should not open a snackbar if attempts to create a team within the size limit', () => {
    subscription = effects.warnInvalidAddition$.subscribe();

    store.setState({
      team: [] 
    });
    store.setState({
      team: createPokemonListMock(1, 1) 
    });

    actions$.next(addPokemon({ pokemon: createPokemonMock() }));

    expect(matSnackBarSpy.open).not.toHaveBeenCalled();
  });
  
});