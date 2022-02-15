import {Component, EventEmitter, Output} from '@angular/core';
import {StreamService} from '../../../shared/api/stream.service';
import {NotificationService} from '../../../shared/service/notification.service';
import {StreamStatus} from '../../../shared/model/metrics.model';
import {Instance} from '../../../shared/model/instance.model';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {TranslateService} from '@ngx-translate/core';

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

  form: FormGroup = new FormGroup({});

  constructor(
    private streamService: StreamService,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  initForm(metrics: StreamStatus[]): void {
    this.instances = [];
    if (metrics && metrics.length > 0) {
      metrics[0].applications.forEach(appStatus => {
        const instance = Instance.fromAppStatus(appStatus);
        this.instances.push(instance);
        this.form.addControl(
          `instance${instance.name}`,
          new FormControl(instance.instanceCount, [Validators.required, Validators.min(1), Validators.max(10000)])
        );
      });
    }
  }

  open(streamName: string): void {
    this.isLoading = true;
    this.streamName = streamName;
    this.streamService.getRuntimeStreamStatuses([streamName]).subscribe(
      (metrics: StreamStatus[]) => {
        this.initForm(metrics);
        this.isLoading = false;
      },
      () => {
        this.isLoading = false;
        this.notificationService.error(
          this.translate.instant('commons.message.error'),
          this.translate.instant('streams.scale.message.loadingErrorContent')
        );
      }
    );
    this.isOpen = true;
  }

  scale(instance: Instance) {
    const scaleTo = this.form.get(`instance${instance.name}`).value;
    instance.isScaling = true;
    this.isRunning = true;
    this.streamService.scaleAppInstance(this.streamName, instance.name, scaleTo).subscribe(
      () => {
        instance.instanceCount = scaleTo;
        this.onScale.emit();
        this.notificationService.success(
          this.translate.instant('streams.scale.message.successTitle'),
          this.translate.instant('streams.scale.message.successContent', {
            name: instance.name,
            count: instance.instanceCount
          })
        );
        instance.isScaling = false;
        this.isRunning = false;
      },
      error => {
        instance.isScaling = false;
        this.isRunning = false;
        this.notificationService.error(this.translate.instant('commons.message.error'), error);
      }
    );
  }

  isValueNotChanged(instance: Instance) {
    return instance?.instanceCount === this.form?.get(`instance${instance.name}`)?.value;
  }
}
