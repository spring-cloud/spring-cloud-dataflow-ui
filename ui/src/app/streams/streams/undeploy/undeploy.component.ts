import {Component, EventEmitter, Output} from '@angular/core';
import {Stream} from '../../../shared/model/stream.model';
import {StreamService} from '../../../shared/api/stream.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-stream-undeploy',
  templateUrl: './undeploy.component.html',
  styles: []
})
export class UndeployComponent {
  streams: Stream[];
  isOpen = false;
  isRunning = false;
  @Output() onUndeployed = new EventEmitter();

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
    this.streamService.undeployStreams(this.streams).subscribe(
      data => {
        if (data.length === 1) {
          this.notificationService.success(
            this.translate.instant('streams.undeploy.message.successTitle'),
            this.translate.instant('streams.undeploy.message.successContent', {name: this.streams[0].name})
          );
        } else {
          this.notificationService.success(
            this.translate.instant('streams.undeploy.message.successTitle2'),
            this.translate.instant('streams.undeploy.message.successContent2', {count: data.length})
          );
        }
        this.onUndeployed.emit(data);
        this.isOpen = false;
        this.isRunning = false;
        this.streams = null;
      },
      () => {
        this.notificationService.error(
          this.translate.instant('commons.message.error'),
          this.translate.instant('streams.undeploy.message.errorContent')
        );
        this.isOpen = false;
        this.isRunning = false;
        this.streams = null;
      }
    );
  }
}
