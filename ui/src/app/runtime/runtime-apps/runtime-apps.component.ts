import { Component, OnDestroy, OnInit } from '@angular/core';
import { RuntimeApp } from '../model/runtime-app';
import { Page } from '../../shared/model';
import { RuntimeAppsService } from '../runtime-apps.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Observable, of, Subscription } from 'rxjs';
import { RuntimeAppComponent } from '../runtime-app/runtime-app.component';
import { PaginationParams } from '../../shared/components/shared.interface';
import { RuntimeAppInstance } from '../model/runtime-app-instance';
import { GrafanaService } from '../../shared/grafana/grafana.service';
import { NotificationService } from '../../shared/services/notification.service';
import { RuntimeStream } from '../model/runtime-stream';

/**
 * Component that loads Runtime applications.
 *
 * @author Ilayaperumal Gopinathan
 * @author Vitrac Damien
 */
@Component({
  selector: 'app-runtime-apps',
  styleUrls: ['./styles.scss'],
  templateUrl: './runtime-apps.component.html',
})
export class RuntimeAppsComponent implements OnInit, OnDestroy {

  /**
   * Observable of a runtime applications page
   */
  runtimeStreams$: Observable<Page<RuntimeStream>>;

  /**
   * Pagination state
   */
  pagination: PaginationParams = { page: 0, size: 30 };

  /**
   * Modal reference
   */
  modal: BsModalRef;

  /**
   * Featured Info
   */
  grafanaEnabled = false;

  /**
   * Grafana Subscription
   */
  grafanaSubscription: Subscription;

  /**
   * Contructor
   *
   * @param {RuntimeAppsService} runtimeAppsService
   * @param {GrafanaService} grafanaService
   * @param {NotificationService} notificationService
   * @param {BsModalService} modalService
   */
  constructor(private runtimeAppsService: RuntimeAppsService,
              private grafanaService: GrafanaService,
              private notificationService: NotificationService,
              private modalService: BsModalService) {
  }

  /**
   * Initialize
   */
  ngOnInit() {
    this.loadRuntimeStreams();
  }

  /**
   * Destroy
   */
  ngOnDestroy() {
    this.grafanaSubscription.unsubscribe();
  }

  /**
   * Row actions
   */
  runtimeActions(item: RuntimeApp, index: number) {
    return [
      {
        id: 'view' + index,
        icon: 'info-circle',
        action: 'view',
        title: 'Show details',
        isDefault: true
      },
      {
        id: 'grafana' + index,
        action: 'grafana',
        icon: 'grafana',
        custom: true,
        title: 'Grafana Dashboard',
        isDefault: true,
        hidden: !this.grafanaEnabled
      },
    ];
  }

// appFeature="streamsEnabled"
  /**
   * Apply Action (row)
   * @param action
   * @param item
   */
  applyAction(action: string, item: RuntimeApp) {
    switch (action) {
      case 'view':
        this.view(item);
        break;
      case 'grafana':
        this.grafanaDashboard(item);
    }
  }

  /**
   * Load runtime applications, request the dedicate service
   */
  loadRuntimeStreams() {
    this.grafanaSubscription = this.grafanaService.isAllowed().subscribe((active) => {
      this.grafanaEnabled = active;
    });
    this.runtimeStreams$ = this.runtimeAppsService.getRuntimeStreams(this.pagination);
  }


  /**
   * Update event from the Paginator Pager
   * @param params
   */
  changePaginationPager(params) {
    this.pagination.page = params.page;
    this.pagination.size = params.size;
    this.loadRuntimeStreams();
  }

  /**
   * View a runtime application in a dedicate modal
   */
  view(runtimeApp: RuntimeApp): void {
    this.modal = this.modalService.show(RuntimeAppComponent, { class: 'modal-xl' });
    this.modal.content.open(runtimeApp);
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

}
