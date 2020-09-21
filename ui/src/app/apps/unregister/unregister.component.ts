import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { App } from '../../shared/model/app.model';
import { AppService } from '../../shared/api/app.service';
import { NotificationService } from '../../shared/service/notification.service';

@Component({
  selector: 'app-unregister',
  templateUrl: './unregister.component.html'
})
export class UnregisterComponent {

  apps: App[];
  isOpen = false;
  isRunning = false;
  @Output() onUnregistered = new EventEmitter();

  constructor(private appsService: AppService,
              private notificationService: NotificationService) {
  }

  open(apps: App[]) {
    this.apps = apps;
    this.isOpen = true;
    this.isRunning = false;
  }

  unregister() {
    this.isRunning = true;
    this.appsService.unregisterApps(this.apps)
      .subscribe(
        data => {
          if (data.length === 1) {
            this.notificationService.success('Unregister application', 'Successfully removed app "'
              + this.apps[0].name + '" of type "' + this.apps[0].type.toString() + '".');
          } else {
            this.notificationService.success('Unregister applications', `${data.length} app(s) unregistered.`);
          }
          this.onUnregistered.emit(data);
          this.isOpen = false;
          this.apps = null;
        }, error => {
          this.notificationService.error('An error occurred', error);
          this.onUnregistered.emit(true);
          this.isOpen = false;
          this.apps = null;
        });
  }

}
