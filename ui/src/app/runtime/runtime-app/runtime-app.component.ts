import { Component } from '@angular/core';
import { RuntimeApp } from '../model/runtime-app';
import { Observable, of } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';
import { GrafanaService } from '../../shared/grafana/grafana.service';
import { map } from 'rxjs/operators';
import { RuntimeAppInstance } from '../model/runtime-app-instance';
import { NotificationService } from '../../shared/services/notification.service';

/**
 * Component that display a Runtime application.
 *
 * @author Ilayaperumal Gopinathan
 * @author Vitrac Damien
 */
@Component({
  selector: 'app-runtime-app',
  styleUrls: ['./styles.scss'],
  templateUrl: './runtime-app.component.html',
})
export class RuntimeAppComponent {

  /**
   * Observable of Runtime Application
   */
  runtimeApp$: Observable<RuntimeApp>;

  /**
   * Featured Info
   */
  grafanaEnabled = false;

  /**
   * Constructor
   *
   * @param modalRef
   * @param notificationService
   * @param grafanaService
   */
  constructor(private modalRef: BsModalRef,
              private notificationService: NotificationService,
              private grafanaService: GrafanaService) {
  }

  /**
   * Set the runtime application
   *
   * @param {RuntimeApp} runtimeApp
   */
  open(runtimeApp: RuntimeApp) {
    this.runtimeApp$ = this.grafanaService.isAllowed()
      .pipe(
        map((active) => {
          this.grafanaEnabled = active;
          console.log(runtimeApp);
          return runtimeApp;
        })
      );
  }

  /**
   * Hide the modal
   */
  cancel() {
    this.modalRef.hide();
  }

  /**
   * Open the grafana dashboard application
   */
  grafanaDashboard(runtimeApp: RuntimeApp): void {
    let appName = '';
    let streamName = '';
    if (runtimeApp.appInstances && runtimeApp.appInstances.length > 0) {
      const firstInstance: RuntimeAppInstance = runtimeApp.appInstances[0];
      if (firstInstance.attributes) {
        appName = firstInstance.attributes['skipper.application.name'];
        streamName = firstInstance.attributes['skipper.release.name'];
      }
    }
    if (streamName && appName) {
      this.grafanaService.getDashboardApplication(streamName, appName).subscribe((url: string) => {
        window.open(url);
      });
    } else {
      this.notificationService.error('Sorry, we can\' open this grafana dashboard');
    }
  }

  /**
   * Open the grafana dashboard application
   */
  grafanaInstanceDashboard(instance: RuntimeAppInstance): void {
    let appName = '';
    let streamName = '';
    let guid = '';
    if (instance.attributes) {
      appName = instance.attributes['skipper.application.name'];
      streamName = instance.attributes['skipper.release.name'];
      guid = instance.attributes['guid'];
    }
    if (streamName && appName && guid) {
      this.grafanaService.getDashboardApplicationInstance(streamName, appName, guid).subscribe((url: string) => {
        window.open(url);
      });
    } else {
      this.notificationService.error('Sorry, we can\' open this grafana dashboard');
    }
  }

}
