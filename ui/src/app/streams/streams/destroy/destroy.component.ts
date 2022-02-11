import {Component, EventEmitter, Output} from '@angular/core';
import {NotificationService} from '../../../shared/service/notification.service';
import {Stream} from '../../../shared/model/stream.model';
import {StreamService} from '../../../shared/api/stream.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-stream-destroy',
  templateUrl: './destroy.component.html',
  styles: []
})
export class DestroyComponent {
  streams: Stream[];
  isOpen = false;
  isRunning = false;
  @Output() onDestroyed = new EventEmitter();

  constructor(
    private streamService: StreamService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  open(streams: Stream[]): void {
    this.streams = streams;
    this.isOpen = true;
  }

  unregister(): void {
    this.isRunning = true;
    this.streamService.destroyStreams(this.streams).subscribe(
      data => {
        if (data.length === 1) {
          this.notificationService.success(
            this.translate.instant('streams.destroy.message.successTitle'),
            this.translate.instant('streams.destroy.message.successContent', {name: this.streams[0].name})
          );
        } else {
          this.notificationService.success(
            this.translate.instant('streams.destroy.message.successTitle2'),
            this.translate.instant('streams.destroy.message.successContent2', {count: data.length})
          );
        }
        this.isRunning = false;
        this.onDestroyed.emit(data);
        this.isOpen = false;
        this.streams = null;
      },
      () => {
        this.isRunning = false;
        this.notificationService.error(
          this.translate.instant('commons.message.error'),
          this.translate.instant('streams.destroy.message.errorContent')
        );
        this.isOpen = false;
        this.streams = null;
      }
    );
  }
}
