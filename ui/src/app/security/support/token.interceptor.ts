import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { Observable } from 'rxjs';
import { SecurityService } from '../service/security.service';

@Injectable()
export class TokenInterceptor implements HttpInterceptor {

  constructor(private inj: Injector) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const securityService = this.inj.get(SecurityService);
    // if (securityService.xAuthToken) {
    //   request = request.clone({
    //     setHeaders: {
    //       'x-auth-token': `${securityService.xAuthToken}`
    //     }
    //   });
    // }
    return next.handle(request);
  }
}
