import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { HttpUtils } from '../../../shared/support/http.utils';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ContentAssistService {

  constructor(private httpClient: HttpClient) {
  }

  getProposals(prefix: string): Observable<Array<string>> {
    const httpHeaders = HttpUtils.getDefaultHttpHeaders();
    const params = new HttpParams()
      .append('start', prefix)
      .append('defaultLevel', '1');
    return this.httpClient.get<any>('/completions/task', {
      headers: httpHeaders,
      params: params
    }).map(jsonResponse => {
      return jsonResponse.proposals;
    });
  }

}
