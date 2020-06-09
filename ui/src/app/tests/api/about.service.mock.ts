import { Injectable } from '@angular/core';
import { catchError, map } from 'rxjs/operators';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { About } from '../../shared/model/about.model';
import { ErrorUtils } from '../../shared/support/error.utils';

import { AboutService } from '../../shared/api/about.service';
import { LOAD } from '../data/about';

@Injectable({
  providedIn: 'root'
})
export class AboutServiceMock {

  static mock: AboutServiceMock = null;

  private aboutSubject = new BehaviorSubject<About>(undefined);
  about: About;

  constructor() {
  }

  getAbout(): Observable<About> {
    return this.aboutSubject.asObservable();
  }

  load(): Observable<About> {
    return of(this.about);
    // .pipe(
    //   map(About.parse),
    //   map((about: About) => {
    //     this.aboutSubject.next(about);
    //     this.about = about;
    //     return about;
    //   }),
    //   catchError(ErrorUtils.catchError)
    // );
  }

  static get provider() {
    if (!AboutServiceMock.mock) {
      AboutServiceMock.mock = new AboutServiceMock();
      AboutServiceMock.mock.about = About.parse(LOAD);
      AboutServiceMock.mock.aboutSubject.next(AboutServiceMock.mock.about)
    }
    return { provide: AboutService, useValue: AboutServiceMock.mock };
  }
}
