import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {StreamService} from '../../../shared/api/stream.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {AppStatus, StreamStatus} from '../../../shared/model/metrics.model';
import {Instance} from 'src/app/shared/model/instance.model';

@Component({
  selector: 'app-stream-scale',
  templateUrl: './scale.component.html',
  styleUrls: ['scale.component.scss']
})
export class ScaleComponent {
  streamName: string;
  instances: Array<Instance> = [];
  isOpen = false;
  isRunning = false;
  isLoading = false;
  @Output() onScale = new EventEmitter();

  constructor(private streamService: StreamService, private notificationService: NotificationService) {}

  open(streamName: string): void {
    this.isLoading = true;
    this.streamName = streamName;
    this.instances = [];
    this.streamService.getRuntimeStreamStatuses([streamName]).subscribe(
      (metrics: StreamStatus[]) => {
        if (metrics && metrics.length > 0) {
          this.instances = metrics[0].applications.map(appStatus => Instance.fromAppStatus(appStatus));
        }
        this.isLoading = false;
      },
      error => {
        this.isLoading = false;
        this.notificationService.error(
          'An error occurred',
          'An error occurred while fetching Stream runtime statuses. Please check the server logs for more details.'
        );
      }
    );
    this.isOpen = true;
  }

  scale(instance: Instance) {
    instance.isScaling = true;
    this.streamService.scaleAppInstance(this.streamName, instance.name, instance.instanceCount).subscribe(
      data => {
        instance.currentInstanceCount = instance.instanceCount;
        this.onScale.emit();
        this.notificationService.success('Scale stream', `${instance.name} app scaled to ${instance.instanceCount}.`);
        instance.isScaling = false;
      },
      error => {
        instance.isScaling = false;
        this.notificationService.error(
          'An error occurred',
          'An error occurred while scaling Stream. Please check the server logs for more details.'
        );
      }
    );
  }

  instanceCanScale(instance: Instance) {
    return instance.currentInstanceCount === instance.instanceCount || instance.isScaling || !instance.isValid();
  }
}
