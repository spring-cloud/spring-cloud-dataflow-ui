import { Component, OnDestroy, OnInit } from '@angular/core';
import { RuntimeApp } from '../model/runtime-app';
import { Page } from '../../shared/model/page';
import { RuntimeAppsService } from '../runtime-apps.service';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Observable, Subscription } from 'rxjs';
import { RuntimeAppComponent } from '../runtime-app/runtime-app.component';
import { PaginationParams } from '../../shared/components/shared.interface';
import { RuntimeAppInstance } from '../model/runtime-app-instance';
import { GrafanaService } from '../../shared/grafana/grafana.service';

/**
 * Component that loads Runtime applications.
 *
 * @author Ilayaperumal Gopinathan
 * @author Vitrac Damien
 */
@Component({
  selector: 'app-runtime-apps',
  templateUrl: './runtime-apps.component.html',
})
export class RuntimeAppsComponent implements OnInit, OnDestroy {

  /**
   * Observable of a runtime applications page
   */
  runtimeApps$: Observable<Page<RuntimeApp>>;

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
   * @param {BsModalService} modalService
   */
  constructor(private runtimeAppsService: RuntimeAppsService,
              private grafanaService: GrafanaService,
              private modalService: BsModalService) {
  }

  /**
   * Initialize
   */
  ngOnInit() {
    this.loadRuntimeApps();
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
      }
    ];
  }

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
    }
  }

  /**
   * Load runtime applications, request the dedicate service
   */
  loadRuntimeApps() {
    this.grafanaSubscription = this.grafanaService.isAllowed().subscribe((active) => {
      this.grafanaEnabled = active;
    });
    this.runtimeApps$ = this.runtimeAppsService.getRuntimeApps(this.pagination);
  }


  /**
   * Update event from the Paginator Pager
   * @param params
   */
  changePaginationPager(params) {
    this.pagination.page = params.page;
    this.pagination.size = params.size;
    this.loadRuntimeApps();
  }

  /**
   * View a runtime application in a dedicate modal
   */
  view(runtimeApp: RuntimeApp): void {
    this.modal = this.modalService.show(RuntimeAppComponent, { class: 'modal-xl' });
    this.modal.content.open(runtimeApp);
  }

  /**
   * Open the grafana dashboard applications
   */
  grafanaDashboard(): void {
    this.grafanaService.getDashboardApplications().subscribe((url: string) => {
      window.open(url);
    });
  }

}
