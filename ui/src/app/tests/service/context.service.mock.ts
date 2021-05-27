import {Observable, of} from 'rxjs';
import {ContextModel} from '../../shared/model/context.model';
import {ContextService} from '../../shared/service/context.service';
import {initialState} from '../../shared/store/context.reducer';

export class ContextServiceMock {
  static mock: ContextServiceMock = null;

  constructor() {}

  update(): Observable<any> {
    return of({});
  }

  dispatch(): Observable<any> {
    return of({});
  }

  getContext(name: string): Observable<any> {
    const ctx = initialState.find(x => x.name === name)?.value || [];
    return of(ctx);
  }

  getContexts(): Observable<any> {
    return of(initialState);
  }

  updateContext(name: string, contexts: ContextModel[]): Observable<any> {
    return of({});
  }

  static get provider(): any {
    if (!ContextServiceMock.mock) {
      ContextServiceMock.mock = new ContextServiceMock();
    }
    return {provide: ContextService, useValue: ContextServiceMock.mock};
  }
}
