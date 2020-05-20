import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError, map } from 'rxjs/operators';
import { ErrorUtils } from '../support/error.utils';
import { About } from '../model/about.model';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AboutService {

  private aboutSubject = new BehaviorSubject<About>(undefined);
  about: About;

  constructor(private httpClient: HttpClient) {
  }

  getAbout(): Observable<About> {
    return this.aboutSubject.asObservable();
  }

  load(): Observable<About> {
    return this.httpClient
      .get<any>('/about')
      .pipe(
        map(About.parse),
        map((about: About) => {
          this.aboutSubject.next(about);
          this.about = about;
          return about;
        }),
        catchError(ErrorUtils.catchError)
      );
  }
}
