import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {App} from '../../shared/model/app.model';
import {AppService} from '../../shared/api/app.service';
import {NotificationService} from '../../shared/service/notification.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-unregister',
  templateUrl: './unregister.component.html'
})
export class UnregisterComponent {
  apps: App[];
  isOpen = false;
  isRunning = false;
  @Output() onUnregistered = new EventEmitter();

  constructor(
    private appsService: AppService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  open(apps: App[]): void {
    this.apps = apps;
    this.isOpen = true;
    this.isRunning = false;
  }

  unregister(): void {
    this.isRunning = true;
    this.appsService.unregisterApps(this.apps).subscribe(
      data => {
        if (data.length === 1) {
          this.notificationService.success(
            this.translate.instant('applications.unregister.message.successTitle'),
            this.translate.instant('applications.unregister.message.successContent', {
              name: this.apps[0].name,
              type: this.apps[0].type.toString()
            })
          );
        } else {
          this.notificationService.success(
            this.translate.instant('applications.unregister.message.successTitle2'),
            this.translate.instant('applications.unregister.message.successContent2', {count: data.length})
          );
        }
        this.onUnregistered.emit(data);
        this.isOpen = false;
        this.apps = null;
      },
      error => {
        this.notificationService.error(this.translate.instant('commons.message.error'), error);
        this.onUnregistered.emit(true);
        this.isOpen = false;
        this.apps = null;
      }
    );
  }
}
