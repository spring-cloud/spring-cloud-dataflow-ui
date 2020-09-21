import { Component, OnDestroy, ViewChild } from '@angular/core';
import { AppService } from '../../shared/api/app.service';
import { StreamService } from '../../shared/api/stream.service';
import { forkJoin, Observable, Subscription } from 'rxjs';
import { NotificationService } from '../../shared/service/notification.service';
import { StreamCreateComponent } from './stream-create/stream-create.component';
import { TaskCreateComponent } from './task-create/task-create.component';
import { ConfirmComponent } from '../../shared/component/confirm/confirm.component';

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

  constructor(private appService: AppService,
              private streamService: StreamService,
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

}
