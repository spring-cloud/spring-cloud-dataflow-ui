import { Component } from '@angular/core';
import { SecurityService } from './security/service/security.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  shouldProtect = this.securityService.shouldProtect();
  securityEnabled = this.securityService.securityEnabled();

  get isDevEnv() {
    return !environment.production;
  }

  constructor(
    private securityService: SecurityService
  ) { }
}
