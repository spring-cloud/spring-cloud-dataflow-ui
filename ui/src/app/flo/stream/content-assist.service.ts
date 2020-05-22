import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpUtils } from '../../shared/support/http.utils';


@Injectable()
export class ContentAssistService {

  constructor(private httpClient: HttpClient) {
  }

  getProposals(prefix: string): Observable<Array<string>> {
    const headers = HttpUtils.getDefaultHttpHeaders();
    const params = new HttpParams()
      .append('start', prefix)
      .append('defaultLevel', '1');
    return this.httpClient
      .get<any>('/completions/stream', { headers, params })
      .pipe(
        map(jsonResponse => {
          return jsonResponse.proposals;
        })
      );
  }

}
