import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { take } from 'rxjs/operators';
import { cold } from 'jasmine-marbles';
import { SecurityService } from './security.service';
import * as fromSecurity from '../store/security.reducer';
import { StoreModule } from '@ngrx/store';

describe('security/service/security.service.ts mock', () => {
  let service: SecurityService;
  let store: MockStore;
  let httpTestingController: HttpTestingController;
  const initialState = { [fromSecurity.securityFeatureKey]: {
    enabled: true,
    authenticated: false,
    username: undefined,
    roles: []
  }};

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        provideMockStore({ initialState })
      ]
    });
    service = TestBed.inject(SecurityService);
    store = TestBed.inject(MockStore);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have security enabled on default', () => {
    const expected = cold('(a|)', {a: true});
    expect(service.securityEnabled().pipe(take(1))).toBeObservable(expected);
  });

  it('should have proper state after loaded', () => {
    const newState = { [fromSecurity.securityFeatureKey]: {
      enabled: false,
      authenticated: true,
      username: 'fakeuser',
      roles: ['role1']
    }};
    store.setState(newState);

    let expected = cold('(a|)', {a: false});
    expect(service.securityEnabled().pipe(take(1))).toBeObservable(expected);

    expected = cold('(a|)', {a: 'fakeuser'});
    expect(service.loggedinUser().pipe(take(1))).toBeObservable(expected);

    expected = cold('(a|)', {a: ['role1']});
    expect(service.roles().pipe(take(1))).toBeObservable(expected);

    expected = cold('(a|)', {a: false});
    expect(service.shouldProtect().pipe(take(1))).toBeObservable(expected);
  });
});

describe('security/service/security.service.ts integration', () => {
  let service: SecurityService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        StoreModule.forRoot({}),
        StoreModule.forFeature(fromSecurity.securityFeatureKey, fromSecurity.reducer)
      ],
    });
    service = TestBed.inject(SecurityService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have proper state after loaded', () => {
    service.loaded(false, true, 'fakeuser', ['role1']);

    let expected = cold('(a|)', {a: false});
    expect(service.securityEnabled().pipe(take(1))).toBeObservable(expected);

    expected = cold('(a|)', {a: 'fakeuser'});
    expect(service.loggedinUser().pipe(take(1))).toBeObservable(expected);

    expected = cold('(a|)', {a: ['role1']});
    expect(service.roles().pipe(take(1))).toBeObservable(expected);

    expected = cold('(a|)', {a: false});
    expect(service.shouldProtect().pipe(take(1))).toBeObservable(expected);
  });
});
