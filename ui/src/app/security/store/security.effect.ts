import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { tap, map } from 'rxjs/operators';
import * as SecurityActions from './security.action';

@Injectable()
export class SecurityEffect {

  securityReset$ = createEffect(() =>
    this.actions$.pipe(
      ofType(SecurityActions.unauthorised),
      map(SecurityActions.logout),
      tap(() => {
        this.router.navigate(['/']);
      })
      ),
    { dispatch: true }
  );

  constructor(
    private actions$: Actions,
    private router: Router
  ) {}
}
