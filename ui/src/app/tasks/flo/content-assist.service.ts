import { Injectable } from '@angular/core';
import { Http, URLSearchParams } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { HttpUtils } from '../../shared/support/http.utils';

import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/map';

@Injectable()
export class ContentAssistService {

  constructor(private http: Http) {}

  getProposals(prefix: string): Observable<Array<string>> {
    const options = HttpUtils.getDefaultRequestOptions();
    options.params = new URLSearchParams();
    options.params.append('start', prefix);
    options.params.append('defaultLevel', '1');
    return this.http.get('/completions/task', options).map(res => {
      return res.json().proposals;
    });
  }

}
