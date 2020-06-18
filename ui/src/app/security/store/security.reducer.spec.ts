import { createAction } from '@ngrx/store';
import * as fromSecurity from './security.reducer';
import * as SecurityActions from './security.action';

describe('security/store/security.reducer.ts', () => {

  it('should return init state', () => {
    const newState = fromSecurity.reducer(undefined, createAction('noop'));
    expect(newState).toEqual(fromSecurity.initialState);
  });

  it('should load and logout', () => {
    let expectedState: fromSecurity.SecurityState = {
      enabled: false,
      authenticated: true,
      username: 'fakeuser',
      roles: ['role1', 'role2']
    };
    let newState = fromSecurity.reducer(undefined, SecurityActions.loaded({
      enabled: false,
      authenticated: true,
      username: 'fakeuser',
      roles: ['role1', 'role2']
    }));
    expect(newState).toEqual(expectedState);
    expectedState = {
      enabled: false,
      authenticated: false,
      username: undefined,
      roles: []
    };
    newState = fromSecurity.reducer(newState, SecurityActions.logout());
    expect(newState).toEqual(expectedState);
  });
});
