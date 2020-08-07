import { Component } from '@angular/core';
import { SecurityService } from './security/service/security.service';
import { ModalService } from './shared/service/modal.service';
import { SettingsComponent } from './settings/settings/settings.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  shouldProtect = this.securityService.shouldProtect();
  securityEnabled = this.securityService.securityEnabled();

  constructor(private securityService: SecurityService,
              private modalService: ModalService) { }

  openSettings() {
    this.modalService.show(SettingsComponent);
  }
}
