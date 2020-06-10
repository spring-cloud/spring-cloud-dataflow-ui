import { Component, EventEmitter, Output } from '@angular/core';
import { StreamHistory } from '../../../shared/model/stream.model';
import { StreamService } from '../../../shared/api/stream.service';
import { NotificationService } from '../../../shared/service/notification.service';

@Component({
  selector: 'app-stream-rollback',
  templateUrl: './rollback.component.html',
  styles: []
})
export class RollbackComponent {
  history: StreamHistory;
  isOpen = false;
  isRunning = false;
  @Output() onRollback = new EventEmitter();

  constructor(private streamService: StreamService,
              private notificationService: NotificationService) {
  }

  open(history: StreamHistory) {
    this.history = history;
    this.isOpen = true;
  }

  close() {
    this.isOpen = false;
  }

  rollback() {
    this.isRunning = true;
    this.streamService.rollbackStream(this.history)
      .subscribe(data => {
          this.notificationService.success('Rollback success', `Successful stream rollback to version '${this.history.version}'`);
          this.onRollback.emit(true);
          this.close();
        }, error => {
          this.notificationService.error('An error occurred', error);
          this.isRunning = false;
        }
      );
  }
}
