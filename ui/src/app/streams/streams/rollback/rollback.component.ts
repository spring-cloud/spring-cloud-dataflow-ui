import {Component, EventEmitter, Output} from '@angular/core';
import {StreamHistory} from '../../../shared/model/stream.model';
import {StreamService} from '../../../shared/api/stream.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {TranslateService} from '@ngx-translate/core';

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

  constructor(
    private streamService: StreamService,
    private notificationService: NotificationService,
    private translation: TranslateService
  ) {}

  open(history: StreamHistory): void {
    this.history = history;
    this.isOpen = true;
  }

  close(): void {
    this.isOpen = false;
  }

  rollback(): void {
    this.isRunning = true;
    this.streamService.rollbackStream(this.history).subscribe(
      data => {
        this.notificationService.success(
          this.translation.instant('streams.rollback.message.successTitle'),
          this.translation.instant('streams.rollback.message.successContent', {version: this.history.version})
        );
        this.onRollback.emit(true);
        this.close();
      },
      error => {
        this.notificationService.error(this.translation.instant('commons.message.error'), error);
        this.isRunning = false;
      }
    );
  }
}
