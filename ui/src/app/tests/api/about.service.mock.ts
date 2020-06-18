import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

import { AboutService } from '../../shared/api/about.service';
import { LOAD } from '../data/about';
import { AboutState } from '../../shared/store/about.reducer';
import { parse } from '../../shared/store/about.support';

@Injectable({
  providedIn: 'root'
})
export class AboutServiceMock {

  static mock: AboutServiceMock = null;

  getAbout(): Observable<AboutState> {
    return of(parse(LOAD));
  }

  load(): Observable<AboutState> {
    return of(parse(LOAD));
  }

  static get provider() {
    if (!AboutServiceMock.mock) {
      AboutServiceMock.mock = new AboutServiceMock();
    }
    return { provide: AboutService, useValue: AboutServiceMock.mock };
  }
}
