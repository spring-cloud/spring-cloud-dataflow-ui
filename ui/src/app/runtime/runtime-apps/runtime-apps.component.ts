import {Component, OnDestroy, OnInit} from '@angular/core';
import {RuntimeApp} from '../model/runtime-app';
import {Page} from '../../shared/model/page';
import {RuntimeAppsService} from '../runtime-apps.service';
import {BsModalService, BsModalRef} from 'ngx-bootstrap';
import {Observable} from 'rxjs/Observable';
import {RuntimeAppComponent} from '../runtime-app/runtime-app.component';
import {Subscription} from 'rxjs/Subscription';
import {PaginationParams} from '../../shared/components/shared.interface';

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
   * Subscription of Runtime Apps
   */
  subscriptionRuntimeApps: Subscription;

  /**
   * Pagination state
   */
  pagination: PaginationParams = {page: 0, size: 10};

  /**
   * Modal reference
   */
  modal: BsModalRef;

  /**
   * Contructor
   *
   * @param {RuntimeAppsService} runtimeAppsService
   * @param {BsModalService} modalService
   */
  constructor(private runtimeAppsService: RuntimeAppsService,
              private modalService: BsModalService) {
  }

  /**
   * Initialize
   */
  ngOnInit() {
    this.loadRuntimeApps();
  }

  /**
   * Initialize
   */
  ngOnDestroy() {
    if (this.subscriptionRuntimeApps) {
      this.subscriptionRuntimeApps.unsubscribe();
    }
  }

  /**
   * Load runtime applications, request the dedicate service
   */
  loadRuntimeApps() {
    if (this.subscriptionRuntimeApps) {
      this.subscriptionRuntimeApps.unsubscribe();
    }
    this.runtimeApps$ = this.runtimeAppsService.getRuntimeApps(this.pagination);
    this.subscriptionRuntimeApps = this.runtimeApps$.subscribe();
  }

  /**
   * Used for requesting a new page. The past is page number is
   * 1-index-based. It will be converted to a zero-index-based
   * page number under the hood.
   *
   * @param page 1-index-based
   */
  getPage(page: number) {
    this.pagination.page = page - 1;
    this.loadRuntimeApps();
  }

  /**
   * View a runtime application in a dedicate modal
   */
  view(runtimeApp: RuntimeApp): void {
    this.modal = this.modalService.show(RuntimeAppComponent, {class: 'modal-xl'});
    this.modal.content.open(runtimeApp);
  }

}
