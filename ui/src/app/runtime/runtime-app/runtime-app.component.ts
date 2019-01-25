import { Component } from '@angular/core';
import { RuntimeApp } from '../model/runtime-app';
import { Observable, of } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';
import { GrafanaService } from '../../shared/grafana/grafana.service';
import { map } from 'rxjs/operators';
import { RuntimeAppInstance } from '../model/runtime-app-instance';

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
   * @param {BsModalRef} modalRef
   * @param grafanaService
   */
  constructor(private modalRef: BsModalRef,
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
  grafanaDashboard(appInstance: RuntimeAppInstance): void {
    this.grafanaService.getDashboardApplication(appInstance).subscribe((url: string) => {
      window.open(url);
    });
  }

}
