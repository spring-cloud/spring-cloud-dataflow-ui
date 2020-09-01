import { Component, OnDestroy, ViewChild } from '@angular/core';
import { AppService } from '../../shared/api/app.service';
import { StreamService } from '../../shared/api/stream.service';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { TaskService } from '../../shared/api/task.service';
import { NotificationService } from '../../shared/service/notification.service';
import { AboutService } from '../../shared/api/about.service';
import { AboutState } from '../../shared/store/about.reducer';
import { SecurityService } from '../../security/service/security.service';
import { SecurityState } from '../../security/store/security.reducer';
import { StreamCreateComponent } from './stream-create/stream-create.component';
import { TaskCreateComponent } from './task-create/task-create.component';
import { ConfirmComponent } from '../../shared/component/confirm/confirm.component';
import { SettingsService } from '../../settings/settings.service';
import { SettingModel } from '../../shared/model/setting.model';

@Component({
  selector: 'app-dev-dasboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnDestroy {
  @ViewChild('streamCreateModal', { static: true }) streamCreateModal: StreamCreateComponent;
  @ViewChild('taskCreateModal', { static: true }) taskCreateModal: TaskCreateComponent;
  @ViewChild('importAppsModal', { static: true }) importAppsModal: ConfirmComponent;
  operationSubscription: Subscription;
  processing = false;
  storesName = '';
  store = null;

  constructor(private appService: AppService,
              private streamService: StreamService,
              private taskService: TaskService,
              private aboutService: AboutService,
              private securityService: SecurityService,
              private settingsService: SettingsService,
              private notificationService: NotificationService) {
  }

  ngOnDestroy(): void {
    if (this.operationSubscription) {
      this.operationSubscription.unsubscribe();
    }
  }

  runOperation(operation: string) {
    if (this.operationSubscription) {
      this.operationSubscription.unsubscribe();
    }
    this.processing = true;
    this.operationSubscription = this.getOperation(operation).subscribe(() => {
      this.processing = false;
      this.notificationService.success('Operation success', 'The operation has been processed with success.');
    });
  }

  createStreams() {
    this.streamCreateModal.open();
  }

  createTasks() {
    this.taskCreateModal.open();
  }

  getOperation(operation: string): Observable<any> {
    switch (operation) {
      case 'IMPORT_APPS':
        return forkJoin([this.getOperation('IMPORT_APPS_STREAM'), this.getOperation('IMPORT_APPS_TASK')]);
      case 'IMPORT_APPS_STREAM':
        return this.appService.importUri('https://dataflow.spring.io/kafka-maven-latest');
      case 'IMPORT_APPS_TASK':
        return this.appService.importUri('https://dataflow.spring.io/task-maven-latest');
    }
    return null;
  }

  importApps() {
    this.importAppsModal.open();
  }

  getStore() {
    this.store = null;
    if (this.storesName === 'about') {
      this.aboutService.getAbout()
        .subscribe((about: AboutState) => {
          this.store = about;
        });

    } else if (this.storesName === 'security') {
      this.securityService.getSecurity()
        .subscribe((security: SecurityState) => {
          this.store = security;
        });
    } else if (this.storesName === 'settings') {
      this.settingsService.getAllSettings()
        .subscribe((settings: SettingModel[]) => {
          this.store = settings;
        });
    }
  }

}
