import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Stream } from '../../../shared/model/stream.model';
import { StreamService } from '../../../shared/api/stream.service';
import { NotificationService } from '../../../shared/service/notification.service';

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

  constructor(private streamService: StreamService,
              private notificationService: NotificationService) {
  }

  open(streams: Stream[]) {
    this.streams = streams;
    this.isOpen = true;
  }

  unregister() {
    this.isRunning = true;
    this.streamService.undeployStreams(this.streams)
      .subscribe(
        data => {
          if (data.length === 1) {
            this.notificationService.success('Undeploy stream', 'Successfully undeploy stream "'
              + this.streams[0].name + '".');
          } else {
            this.notificationService.success('Undeploy streams', `${data.length} stream(s) undeployed.`);
          }
          this.onUndeployed.emit(data);
          this.isOpen = false;
          this.isRunning = false;
          this.streams = null;
        }, error => {
          this.notificationService.error('An error occurred', 'An error occurred while undeploying Streams. ' +
            'Please check the server logs for more details.');
          this.isOpen = false;
          this.isRunning = false;
          this.streams = null;
        });
  }
}
