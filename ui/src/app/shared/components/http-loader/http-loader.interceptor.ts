import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, finalize, map } from 'rxjs/operators';
import { HttpLoaderService } from './http-loader.service';
import * as uuidv4 from 'uuid/v4';

/**
 * Interceptor HttpLoader
 */
@Injectable()
export class HttpLoaderInterceptor implements HttpInterceptor {

  /**
   * Constructor
   * @param httpLoaderService
   */
  constructor(private httpLoaderService: HttpLoaderService) {
  }

  /**
   * Intercept
   * @param req
   * @param next
   */
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const key = `${new Date().getTime()}-${uuidv4()}`;
    this.httpLoaderService.add(key);
    return next.handle(req).pipe(
      map(event => {
        return event;
      }),
      catchError(error => {
        return throwError(error);
      }),
      finalize(() => {
        this.httpLoaderService.complete(key);
      })
    );
  }
}
