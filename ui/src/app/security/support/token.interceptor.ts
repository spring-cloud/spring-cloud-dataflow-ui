import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { SecurityService } from '../service/security.service';
import { delay } from 'rxjs/operators';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private inj: Injector) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const securityService = this.inj.get(SecurityService);
    if (securityService.xAuthToken) {
      request = request.clone({
        setHeaders: {
          'x-auth-token': `${securityService.xAuthToken}`
        }
      });
    }
    if (['/security/info', '/about'].indexOf(request.url) > -1) {
      return next.handle(request);
    }
    return next.handle(request).pipe(delay(2000));
  }
}
