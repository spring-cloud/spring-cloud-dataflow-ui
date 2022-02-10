import {Component, EventEmitter, Output} from '@angular/core';
import {StreamService} from '../../../shared/api/stream.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {StreamStatus} from '../../../shared/model/metrics.model';
import {Instance} from 'src/app/shared/model/instance.model';
import {FormArray, FormControl, FormGroup, Validators} from '@angular/forms';

@Component({
  selector: 'app-stream-scale',
  templateUrl: './scale.component.html',
  styleUrls: ['scale.component.scss']
})
export class ScaleComponent {
  streamName: string;
  isOpen = false;
  isRunning = false;
  isLoading = false;
  @Output() onScale = new EventEmitter();

  instances: Array<Instance> = [];

  scaleForm: FormGroup = new FormGroup({
    instanceCount: new FormArray([])
  });

  instancesForm: FormArray = this.scaleForm.get('instanceCount') as FormArray;

  constructor(private streamService: StreamService, private notificationService: NotificationService) {}

  open(streamName: string): void {
    this.isLoading = true;
    this.streamName = streamName;
    this.instances = [];

    this.streamService.getRuntimeStreamStatuses([streamName]).subscribe(
      (metrics: StreamStatus[]) => {
        if (metrics && metrics.length > 0) {
          metrics[0].applications.forEach(appStatus => {
            const instance = Instance.fromAppStatus(appStatus);

            this.instances.push(instance);
            this.instancesForm.push(new FormControl(instance.instanceCount, [Validators.required, Validators.min(0)]));
          });
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

  scale(instanceNumber: number) {
    const instance = this.instances[instanceNumber];
    const scaleTo = this.instancesForm.controls[instanceNumber].value;
    instance.isScaling = true;
    this.streamService.scaleAppInstance(this.streamName, instance.name, scaleTo).subscribe(
      data => {
        instance.instanceCount = scaleTo;
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

  isValueNotChanged(instanceNumber: number) {
    return this.instances[instanceNumber].instanceCount === this.instancesForm.controls[instanceNumber].value;
  }
}
