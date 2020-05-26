import { Injectable } from '@angular/core';
import { HttpUtils } from '../support/http.utils';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { RuntimeStreamPage } from '../model/runtime.model';
import { ErrorUtils } from '../support/error.utils';

@Injectable({
  providedIn: 'root'
})
export class RuntimeService {

  constructor(private httpClient: HttpClient) { }

  getRuntime(page: number, size: number): Observable<RuntimeStreamPage> {
    const params = HttpUtils.getPaginationParams(page, size);
    const headers = HttpUtils.getDefaultHttpHeaders();
    return this.httpClient
      .get<any>('/runtime/streams', { params, headers })
      .pipe(
        map(RuntimeStreamPage.parse),
        catchError(ErrorUtils.catchError)
      );
  }
}
