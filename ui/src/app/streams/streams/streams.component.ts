import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild } from '@angular/core';
import { Page } from '../../shared/model';
import { StreamDefinition } from '../model/stream-definition';
import { StreamsService } from '../streams.service';
import { Subscription } from 'rxjs/Subscription';
import { StreamMetrics } from '../model/stream-metrics';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { StreamsDeployComponent } from '../streams-deploy/streams-deploy.component';
import { StreamsUndeployComponent } from '../streams-undeploy/streams-undeploy.component';
import { StreamsDestroyComponent } from '../streams-destroy/streams-destroy.component';
import { SortParams, OrderParams, ListDefaultParams } from '../../shared/components/shared.interface';
import { IntervalObservable } from 'rxjs/observable/IntervalObservable';
import { StreamListParams } from '../components/streams.interface';
import { Subject } from 'rxjs/Subject';
import { mergeMap, takeUntil } from 'rxjs/operators';
import { BusyService } from '../../shared/services/busy.service';
import { AppsService } from '../../apps/apps.service';
import { AppRegistration } from '../../shared/model/app-registration.model';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { AppError } from '../../shared/model/error.model';
import { map } from 'rxjs/internal/operators';
import { ListBarComponent } from '../../shared/components/list/list-bar.component';
import { AuthService } from '../../auth/auth.service';
import { Observable } from 'rxjs/Observable';

@Component({
  selector: 'app-streams',
  templateUrl: './streams.component.html',
  styleUrls: ['./styles.scss'],
  encapsulation: ViewEncapsulation.None
})

/**
 * Component that handles the listing and undeploy of stream definitions
 * as well as the routing to other components for detail, deployment and
 * creation of a {@link StreamDefinition}.
 *
 * @author Janne Valkealahti
 * @author Gunnar Hillert
 * @author Glenn Renfro
 * @author Damien Vitrac
 */
export class StreamsComponent implements OnInit, OnDestroy {

  /**
   * Current page of Stream definitions
   */
  streamDefinitions: Page<StreamDefinition>;

  /**
   * Busy Subscriptions
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * List Bar Component
   */
  @ViewChild('listBar')
  listBar: ListBarComponent;

  /**
   * Metrics Subscription
   */
  metricsSubscription: Subscription;

  /**
   * Array of metrics
   */
  metrics: StreamMetrics[];

  /**
   * Modal reference
   */
  modal: BsModalRef;

  /**
   * Current forms value
   */
  form: any = {
    q: '',
    type: '',
    checkboxes: [],
    checkboxesExpand: []
  };

  /**
   * State of App List Params
   */
  params: StreamListParams = {
    sort: 'name',
    order: OrderParams.ASC,
    page: 0,
    size: 30,
    q: ''
  };

  /**
   * State of application register empty
   */
  noApplicationRegister: boolean;

  /**
   * Contain a key application of each selected application
   * @type {Array}
   */
  itemsSelected: Array<string> = [];

  /**
   * Contain a key application of each expanded application
   * @type {Array}
   */
  itemsExpanded: Array<string> = [];

  /**
   * Storage context
   */
  context: any;

  /**
   * Apps State
   */
  appsState$: Observable<any>;

  /**
   * Initialize component
   *
   * @param {StreamsService} streamsService
   * @param {BsModalService} modalService
   * @param {AppsService} appsService
   * @param {BusyService} busyService
   * @param {NotificationService} notificationService
   * @param {LoggerService} loggerService
   * @param {AuthService} authService
   * @param {Router} router
   */
  constructor(public streamsService: StreamsService,
              private modalService: BsModalService,
              private appsService: AppsService,
              private busyService: BusyService,
              private notificationService: NotificationService,
              private loggerService: LoggerService,
              private authService: AuthService,
              private router: Router) {
  }

  /**
   * Stream selected actions
   */
  streamsActions() {
    return [
      {
        id: 'deploy-streams',
        icon: 'play',
        action: 'deploySelected',
        title: 'Deploy stream(s)',
        hidden: !this.authService.securityInfo.canAccess(['ROLE_CREATE'])
      },
      {
        id: 'undeploy-streams',
        icon: 'pause',
        action: 'undeploySelected',
        title: 'Undeploy stream(s)',
        hidden: !this.authService.securityInfo.canAccess(['ROLE_CREATE'])
      },
      {
        id: 'destroy-streams',
        icon: 'trash',
        action: 'destroySelected',
        title: 'Destroy stream(s)',
        hidden: !this.authService.securityInfo.canAccess(['ROLE_CREATE'])
      },
    ];
  }

  /**
   * Row actions
   * @param {AppRegistration} item
   * @param {number} index
   */
  streamActions(item: StreamDefinition, index: number) {
    return [
      {
        id: 'details-stream' + index,
        action: 'details',
        icon: 'info-circle',
        title: 'Show details',
        isDefault: true
      },
      {
        divider: true,
        hidden: !this.authService.securityInfo.canAccess(['ROLE_CREATE'])
      },
      {
        id: 'deploy-stream' + index,
        action: 'deploy',
        icon: 'play',
        title: 'Deploy stream',
        isDefault: (item.status === 'undeployed'),
        hidden: !this.authService.securityInfo.canAccess(['ROLE_CREATE'])
      },
      {
        id: 'undeploy-stream' + index,
        action: 'undeploy',
        icon: 'pause',
        title: 'Undeploy stream',
        isDefault: !(item.status === 'undeployed'),
        disabled: (item.status === 'undeployed'),
        hidden: !this.authService.securityInfo.canAccess(['ROLE_CREATE'])
      },
      {
        divider: true,
        hidden: !this.authService.securityInfo.canAccess(['ROLE_CREATE'])
      },
      {
        id: 'destroy-stream' + index,
        action: 'destroy',
        icon: 'trash',
        title: 'Destroy stream',
        hidden: !this.authService.securityInfo.canAccess(['ROLE_CREATE'])
      },
    ];
  }

  /**
   * Apply Action
   * @param {string} action
   * @param {any} args
   */
  applyAction(action: string, args?: any) {
    switch (action) {
      case 'details':
        this.details(args);
        break;
      case 'deploy':
        this.deploy(args);
        break;
      case 'undeploy':
        this.undeploy(args);
        break;
      case 'destroy':
        this.destroy(args);
        break;
      case 'deploySelected':
        this.deploySelectedStreams();
        break;
      case 'undeploySelected':
        this.undeploySelectedStreams();
        break;
      case 'destroySelected':
        this.destroySelectedStreams();
        break;
    }
  }

  /**
   * Retrieves the {@link StreamDefinition}s to be displayed on the page.
   */
  ngOnInit() {
    this.context = this.streamsService.streamsContext;
    this.params = { ...this.context };
    this.form = { q: this.context.q, checkboxes: [], checkboxesExpand: [] };
    this.itemsSelected = this.context.itemsSelected || [];
    this.itemsExpanded = this.context.itemsExpanded || [];

    this.appsState$ = this.appsService.appsState();
    this.refresh();

    this.metricsSubscription = IntervalObservable.create(2000).subscribe(() => this.loadStreamMetrics());
  }

  /**
   * Close subscription
   */
  ngOnDestroy() {
    if (this.metricsSubscription) {
      this.metricsSubscription.unsubscribe();
    }
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Initializes the streamDefinitions attribute with the results from Spring Cloud Data Flow server.
   */
  refresh() {
    this.loggerService.log('Loading Stream Definitions...', this.params);
    const busy = this.streamsService
      .getDefinitions(this.params)
      .map((page: Page<StreamDefinition>) => {
        this.form.checkboxes = page.items.map((stream) => {
          return this.itemsSelected.indexOf(stream.name) > -1;
        });
        this.form.checkboxesExpand = page.items.map((stream) => {
          return this.itemsExpanded.indexOf(stream.name) > -1;
        });
        return page;
      })
      .pipe(
        mergeMap(
          val => this.appsService.getApps({
            q: '', type: null, page: 0, size: 1, order: 'name', sort: OrderParams.ASC
          }).pipe(map((val2) => {
            return {
              streams: val,
              apps: val2,
            };
          })))
      )
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((value: { streams: Page<StreamDefinition>, apps: Page<AppRegistration> }) => {
          if (value.streams.items.length === 0 && this.params.page > 0) {
            this.params.page = 0;
            this.refresh();
            return;
          }
          this.noApplicationRegister = !(value.apps.totalElements > 0);
          this.streamDefinitions = value.streams;
          this.changeExpand();
          this.changeCheckboxes();
          this.updateContext();
        },
        error => {
          this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
        });

    this.busyService.addSubscription(busy);
  }

  /**
   * Write the context in the service.
   */
  updateContext() {
    this.context.q = this.params.q;
    this.context.sort = this.params.sort;
    this.context.order = this.params.order;
    this.context.page = this.params.page;
    this.context.size = this.params.size;
    this.context.itemsSelected = this.itemsSelected;
    this.context.itemsExpanded = this.itemsExpanded;
  }

  /**
   * Apply sort
   * Triggered on column header click
   *
   * @param {SortParams} sort
   */
  applySort(sort: SortParams) {
    this.params.sort = sort.sort;
    this.params.order = sort.order;
    this.refresh();
  }

  /**
   * Run the search
   */
  search(params: ListDefaultParams) {
    this.params.q = params.q;
    this.params.page = 0;
    this.refresh();
  }

  /**
   * Update the list of selected checkbox
   */
  changeCheckboxes() {
    if (!this.streamDefinitions || (this.streamDefinitions.items.length !== this.form.checkboxes.length)) {
      return;
    }
    const value: Array<string> = this.streamDefinitions.items.map((app, index) => {
      if (this.form.checkboxes[index]) {
        return app.name;
      }
    }).filter((a) => a != null);
    this.itemsSelected = value;
    this.updateContext();
  }

  /**
   * Update the list of selected checkbox
   */
  changeExpand() {
    if (!this.streamDefinitions || (this.streamDefinitions.items.length !== this.form.checkboxesExpand.length)) {
      return;
    }
    const value: Array<string> = this.streamDefinitions.items.map((app, index) => {
      if (this.form.checkboxesExpand[index]) {
        return app.name;
      }
    }).filter((a) => a != null);
    this.itemsExpanded = value;
    this.updateContext();
  }

  /**
   * Loads streams metrics data
   */
  loadStreamMetrics() {
    const streamNames = this.streamDefinitions && Array.isArray(this.streamDefinitions.items) ?
      this.streamDefinitions.items
        .filter(i => i.status === 'deployed')
        .map(s => s.name.toString())
      : [];
    if (streamNames.length) {
      this.streamsService.getMetrics(streamNames).subscribe(metrics => this.metrics = metrics);
    } else {
      this.metrics = [];
    }
  }

  /**
   * Toogle Expand
   */
  toggleExpand(index) {
    this.form.checkboxesExpand[index] = !this.form.checkboxesExpand[index];
    this.changeExpand();
  }

  /**
   * Expands all definition entries to show flo diagram on list page.
   */
  expandPage() {
    this.loggerService.log('Expand all.');
    this.form.checkboxesExpand = this.streamDefinitions.items.map(() => true);
    this.changeExpand();
  }

  /**
   * Collapses all definition entries to hid the flow diagrams on list page.
   */
  collapsePage() {
    this.loggerService.log('Collapse all.');
    this.form.checkboxesExpand = this.streamDefinitions.items.map(() => false);
    this.changeExpand();
  }

  /**
   * Number of selected stream definitions
   * @returns {number}
   */
  countSelected(): number {
    return this.form.checkboxes.filter((a) => a).length;
  }

  /**
   * Update event from the Paginator Pager
   * @param params
   */
  changePaginationPager(params) {
    this.params.page = params.page;
    this.params.size = params.size;
    this.updateContext();
    this.refresh();
  }

  /**
   * Route to {@link StreamDefinition} details page.
   * @param item the stream definition to be displayed.
   */
  details(item: StreamDefinition) {
    this.router.navigate(['streams/definitions/' + item.name]);
  }

  /**
   * Undeploys the {@link StreamDefinition} and displays toasty message after complete.
   * @param item the stream definition to be undeployed.
   */
  undeploy(item: StreamDefinition) {
    const busy = this.streamsService
      .undeployDefinition(item)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(data => {
        this.notificationService.success(`Successfully undeployed stream definition "${item.name}"`);
      });

    this.busyService.addSubscription(busy);
  }

  /**
   * Starts the undeploy process of multiple {@link StreamDefinition}s
   * by opening a confirmation modal dialog.
   */
  undeploySelectedStreams() {
    const streamDefinitions = this.streamDefinitions.items
      .filter((item) => this.itemsSelected.indexOf(item.name) > -1);
    this.undeployStreams(streamDefinitions);
  }

  /**
   * Route to stream deployment page.
   * @param item the stream definition to be deployed.
   */
  deploy(item: StreamDefinition) {
    this.router.navigate(['streams/definitions/' + item.name + '/deploy']);
  }

  /**
   * Starts the deploy process of multiple {@link StreamDefinition}s
   * by opening a confirmation modal dialog.
   */
  deploySelectedStreams() {
    const streamDefinitions = this.streamDefinitions.items
      .filter((item) => this.itemsSelected.indexOf(item.name) > -1)
      .map(item => {
        item.deploymentProperties = {};
        return item;
      });
    if (streamDefinitions.length === 0) {
      return;
    }

    this.deployStreams(streamDefinitions);
  }

  /**
   * Removes the {@link StreamDefinition} from the repository.  Shows modal dialog
   * prior to deletion to verify if user wants to destroy definition.
   * @param item the stream definition to be removed.
   */
  destroy(item: StreamDefinition) {
    this.destroyStreams([item]);
  }

  /**
   * Starts the destroy process of multiple {@link StreamDefinition}s
   * by opening a confirmation modal dialog.
   */
  destroySelectedStreams() {
    const streamDefinitions = this.streamDefinitions.items
      .filter((item) => this.itemsSelected.indexOf(item.name) > -1);
    this.destroyStreams(streamDefinitions);
  }

  /**
   * Starts the destroy the {@link StreamDefinition}s in parameter
   * by opening a confirmation modal dialog.
   * @param {StreamDefinition[]} streamDefinitions
   */
  destroyStreams(streamDefinitions: StreamDefinition[]) {
    if (streamDefinitions.length === 0) {
      return;
    }
    this.loggerService.log(`Destroy ${streamDefinitions} stream definition(s).`, streamDefinitions);
    const className = streamDefinitions.length > 1 ? 'modal-lg' : 'modal-md';
    this.modal = this.modalService.show(StreamsDestroyComponent, { class: className });
    this.modal.content.open({ streamDefinitions: streamDefinitions }).subscribe(() => {
      if (this.streamDefinitions.items.length === 0 &&
        this.streamDefinitions.pageNumber > 0) {
        this.streamDefinitions.pageNumber = this.streamDefinitions.pageNumber - 1;
      }
      this.refresh();
    });
  }

  /**
   * Starts the deploy process of multiple {@link StreamDefinition}s
   * by opening a confirmation modal dialog.
   */
  deployStreams(streamDefinitions: StreamDefinition[]) {
    if (streamDefinitions.length === 0) {
      return;
    }

    if (streamDefinitions.length === 1) {
      this.router.navigate(['streams/definitions/' + streamDefinitions[0].name + '/deploy']);
    } else {
      this.loggerService.log(`Deploy ${streamDefinitions.length} stream definition(s).`, streamDefinitions);
      this.modal = this.modalService.show(StreamsDeployComponent, { class: 'modal-xl' });
      this.modal.content.open({ streamDefinitions: streamDefinitions }).subscribe(() => {
        this.refresh();
      });
    }
  }

  /**
   * Starts the undeploy process of multiple {@link StreamDefinition}s
   * by opening a confirmation modal dialog.
   */
  undeployStreams(streamDefinitions: StreamDefinition[]) {
    if (streamDefinitions.length === 0) {
      return;
    }
    this.loggerService.log(`Undeploy ${streamDefinitions.length} stream definition(s).`, streamDefinitions);
    this.modal = this.modalService.show(StreamsUndeployComponent, { class: 'modal-lg' });
    this.modal.content.open({ streamDefinitions: streamDefinitions }).subscribe(() => {
      this.refresh();
    });
  }

  /**
   * Metrics for stream
   * @param {string} name
   * @returns {StreamMetrics}
   */
  metricsForStream(name: string): StreamMetrics {
    if (Array.isArray(this.metrics)) {
      return this.metrics.find(m => m.name === name);
    }
  }

  /**
   * Determine show deployment info
   *
   * @param {StreamDefinition} item
   * @returns {boolean} more info is required
   */
  canShowDeploymentInfo(item: StreamDefinition) {
    return item.status === 'deployed'
      || item.status === 'deploying'
      || item.status === 'failed'
      || item.status === 'incomplete';
  }

  /**
   * Navigate to the create stream
   */
  createStream() {
    this.router.navigate(['/streams/create']);
  }

  /**
   * Navigate to the register app
   */
  registerApps() {
    this.router.navigate(['/apps/add']);
  }

}
