import { Component } from '@angular/core';
import { SecurityService } from './security/service/security.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  shouldProtect = this.securityService.shouldProtect();
  securityEnabled = this.securityService.securityEnabled();

  constructor(
    private securityService: SecurityService
  ) { }
}
