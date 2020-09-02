import { of } from 'rxjs';
import { ContextModel } from '../../shared/model/context.model';
import { ContextService } from '../../shared/service/context.service';
import { initialState } from '../../shared/store/context.reducer';

export class ContextServiceMock {

  static mock: ContextServiceMock = null;

  constructor() {
  }

  update() {
    return of({});
  }

  dispatch() {
    return of({});
  }

  getContext(name: string) {
    const ctx = initialState.find(x => x.name === name)?.value || [];
    return of(ctx);
  }

  getContexts() {
    return of(initialState);
  }

  updateContext(name: string, contexts: ContextModel[]) {
    return of({});
  }

  static get provider() {
    if (!ContextServiceMock.mock) {
      ContextServiceMock.mock = new ContextServiceMock();
    }
    return { provide: ContextService, useValue: ContextServiceMock.mock };
  }

}
