import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { SecurityService } from '../service/security.service';

@Injectable()
export class SecurityInterceptor implements HttpInterceptor {

  constructor(
    private securityService: SecurityService
  ) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    request = request.clone({
      setHeaders: {
        'X-Requested-With': 'XMLHttpRequest'
      }
    });
    return next.handle(request).pipe(
      tap(
        () => {},
        (err: any) => {
          if (err instanceof HttpErrorResponse) {
            if (err.status !== 401) {
              return;
            }
            this.securityService.unauthorised();
          }
        }
      )
    );
  }
}
