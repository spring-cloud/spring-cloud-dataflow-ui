import {TestBed, waitForAsync} from '@angular/core/testing';
import {provideMockActions} from '@ngrx/effects/testing';
import {cold} from 'jasmine-marbles';
import {Router} from '@angular/router';
import {Action} from '@ngrx/store';
import {Observable, of} from 'rxjs';
import * as SecurityAction from './security.action';
import {SecurityEffect} from './security.effect';

describe('Security Effect', () => {
  let effects: SecurityEffect;
  let actions$: Observable<Action>;
  const routerSpy = jasmine.createSpyObj('Router', ['navigate']);

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      providers: [SecurityEffect, provideMockActions(() => actions$), {provide: Router, useValue: routerSpy}]
    }).compileComponents();
    effects = TestBed.inject(SecurityEffect);
  }));

  it('Unauthorised should logout', () => {
    const props = {
      authenticated: false,
      enabled: false,
      username: '',
      roles: [],
      clientRegistrations: []
    };
    actions$ = of(SecurityAction.unauthorised(props));
    const expected = cold('(a|)', {a: SecurityAction.logout(props)});
    expect(effects.securityReset$).toBeObservable(expected);
    expect(routerSpy.navigate).toHaveBeenCalledWith(['/']);
  });
});
