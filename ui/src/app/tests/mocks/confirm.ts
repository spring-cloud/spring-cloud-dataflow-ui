import {Observable} from 'rxjs/Observable';

/**
 * Mock for {@link ConfirmService}.
 *
 * Create a mocked service:
 * const confirmService = new MockConfirmService();
 * TestBed.configureTestingModule({
 *   providers: [
 *     { provide: ConfirmService, useValue: confirmService }
 *   ]
 * }).compileComponents();
 *
 * @author Damien Vitrac
 */
export class MockConfirmService {

  open(title: string, description: string, options: any = {}): Observable<any> {
    return Observable.of({});
  }

}
