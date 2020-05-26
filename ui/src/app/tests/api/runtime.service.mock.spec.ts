import { RuntimeService } from '../../shared/api/runtime.service';
import { Observable, of } from 'rxjs';
import { RuntimeStreamPage } from '../../shared/model/runtime.model';
import { GET_RUNTIME } from '../data/runtime';
import { delay, map } from 'rxjs/operators';

export class RuntimeServiceMock {

  static mock: RuntimeServiceMock = null;

  constructor() {
  }

  getRuntime(page: number, size: number): Observable<RuntimeStreamPage> {
    return of(GET_RUNTIME)
      .pipe(
        delay(1),
        map(RuntimeStreamPage.parse),
      );
  }

  static get provider() {
    if (!RuntimeServiceMock.mock) {
      RuntimeServiceMock.mock = new RuntimeServiceMock();
    }
    return { provide: RuntimeService, useValue: RuntimeServiceMock.mock };
  }
}
