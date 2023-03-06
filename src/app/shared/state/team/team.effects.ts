import { Injectable } from "@angular/core";
import { MatSnackBar } from "@angular/material/snack-bar";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { pairwise, startWith, tap, withLatestFrom } from "rxjs";
import { AppState } from "../app.state";
import { addPokemon } from './team.actions';
import { selectTeam} from './team.selectors';

@Injectable()
export class TeamEffects {

  constructor(
    private actions$: Actions,
    private store: Store<AppState>,
    private snackBar: MatSnackBar
  ) {}

  warnInvalidAddition$ = createEffect(() => this.actions$.pipe(
    ofType(addPokemon),
    withLatestFrom(this.store.select(selectTeam).pipe(startWith([]), pairwise())),
    tap(([actions , [previousTeam, currentTeam]]) => {
      const isTeamComplete = previousTeam.length === 6;
      if (isTeamComplete) {
        this.snackBar.open(
          'Your team cannot have more than 6 pokemons.',
          'Dismiss',
          { horizontalPosition: 'end', verticalPosition: 'top'}
        );
      }

    })
  ), { dispatch: false });
}