import { Component, OnInit, OnDestroy, ViewEncapsulation, ViewChild, NgZone, ChangeDetectorRef } from '@angular/core';
import { Page } from '../../shared/model';
import { StreamDefinition } from '../model/stream-definition';
import { StreamsService } from '../streams.service';
import { of, Subscription, timer } from 'rxjs';
import { StreamStatuses } from '../model/stream-metrics';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { StreamsDeployComponent } from '../streams-deploy/streams-deploy.component';
import { StreamsUndeployComponent } from '../streams-undeploy/streams-undeploy.component';
import { StreamsDestroyComponent } from '../streams-destroy/streams-destroy.component';
import { SortParams, OrderParams, ListDefaultParams } from '../../shared/components/shared.interface';
import { StreamListParams } from '../components/streams.interface';
import { mergeMap, takeUntil, map, finalize } from 'rxjs/operators';
import { AppsService } from '../../apps/apps.service';
import { AppRegistration } from '../../shared/model/app-registration.model';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { AppError } from '../../shared/model/error.model';
import { ListBarComponent } from '../../shared/components/list/list-bar.component';
import { AuthService } from '../../auth/auth.service';
import { Observable, Subject } from 'rxjs';
import { SharedAboutService } from '../../shared/services/shared-about.service';
import { GrafanaService } from '../../shared/grafana/grafana.service';
import { BlockerService } from '../../shared/components/blocker/blocker.service';

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
   * Unsubscribe
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * List Bar Component
   */
  @ViewChild('listBar', { static: true })
  listBar: ListBarComponent;

  /**
   * Metrics Subscription
   */
  metricsSubscription: Subscription;

  /**
   * Array of streamStatuses
   */
  streamStatuses: StreamStatuses[];

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
   * Grafana Subscription
   */
  grafanaEnabledSubscription: Subscription;

  /**
   * Featured Info
   */
  grafanaEnabled = false;

  /**
   * Runtime Statuses Subscription
   */
  runtimeStreamStatusesSubscription: Subscription;

  /**
   * Time Subscription
   */
  timeSubscription: Subscription;

  /**
   * Initialize component
   *
   * @param streamsService
   * @param modalService
   * @param appsService
   * @param notificationService
   * @param loggerService
   * @param authService
   * @param sharedAboutService
   * @param grafanaService
   * @param blockerService
   * @param router
   */
  constructor(public streamsService: StreamsService,
              private modalService: BsModalService,
              private appsService: AppsService,
              private notificationService: NotificationService,
              private loggerService: LoggerService,
              private authService: AuthService,
              private sharedAboutService: SharedAboutService,
              private grafanaService: GrafanaService,
              private blockerService: BlockerService,
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
        hidden: !this.authService.securityInfo.canAccess(['ROLE_DEPLOY'])
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
        hidden: !this.authService.securityInfo.canAccess(['ROLE_DESTROY'])
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
        id: 'grafana-stream' + index,
        action: 'grafana',
        icon: 'grafana',
        custom: true,
        title: 'Grafana Dashboard',
        isDefault: true,
        disabled: (item.status === 'undeployed'),
        hidden: !this.grafanaEnabled
      },
      {
        divider: true,
        hidden: !this.authService.securityInfo.canAccess(['ROLE_MODIFY', 'ROLE_DEPLOY', 'ROLE_CREATE'])
      },
      {
        id: 'deploy-stream' + index,
        action: 'deploy',
        icon: 'play',
        title: 'Deploy stream',
        isDefault: true,
        hidden: !this.authService.securityInfo.canAccess(['ROLE_DEPLOY']) || (item.status !== 'undeployed')
      },
      {
        id: 'update-stream' + index,
        action: 'deploy',
        icon: 'edit',
        title: 'Update stream',
        isDefault: true,
        hidden: !this.authService.securityInfo.canAccess(['ROLE_MODIFY']) || (item.status === 'undeployed')
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
        hidden: !this.authService.securityInfo.canAccess(['ROLE_DESTROY'])
      },
      {
        id: 'destroy-stream' + index,
        action: 'destroy',
        icon: 'trash',
        title: 'Destroy stream',
        hidden: !this.authService.securityInfo.canAccess(['ROLE_DESTROY'])
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
      case 'grafana':
        this.grafanaStreamDashboard(args);
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
    this.grafanaEnabledSubscription = this.grafanaService.isAllowed().subscribe((active: boolean) => {
      this.grafanaEnabled = active;
    });
    this.appsState$ = this.appsService.appsState();
    this.refresh();
  }

  /**
   * Close subscription
   */
  ngOnDestroy() {
    if (this.metricsSubscription) {
      this.metricsSubscription.unsubscribe();
    }
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
    if (this.runtimeStreamStatusesSubscription) {
      this.runtimeStreamStatusesSubscription.unsubscribe();
    }
    this.grafanaEnabledSubscription.unsubscribe();
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Initializes the streamDefinitions attribute with the results from Spring Cloud Data Flow server.
   */
  refresh() {
    this.loggerService.log('Loading Stream Definitions...', this.params);
    this.streamsService
      .getDefinitions(this.params)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .pipe(
        map((page: Page<StreamDefinition>) => {
          this.form.checkboxes = page.items.map((stream) => {
            return this.itemsSelected.indexOf(stream.name) > -1;
          });
          this.form.checkboxesExpand = page.items.map((stream) => {
            return this.itemsExpanded.indexOf(stream.name) > -1;
          });
          return page;
        }),
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
      .subscribe((value: { streams: Page<StreamDefinition>, apps: Page<AppRegistration>, statuses: any }) => {
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

          if (!this.timeSubscription) {
            this.loadStreamMetrics();
            this.timeSubscription = timer(0, 10 * 1000)
              .subscribe(() => {
                this.loadStreamMetrics();
              });
          }

        },
        error => {
          this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
        });
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
    this.loadStreamMetrics();
  }

  /**
   * Loads streams streamStatuses data
   */
  loadStreamMetrics() {
    const streamNames = this.streamDefinitions && Array.isArray(this.streamDefinitions.items) ?
      this.streamDefinitions.items
        .filter(i => {
          if (!((i.status === 'deployed') || (i.status === 'deploying') || (i.status === 'partial'))) {
            return false;
          }
          if (this.itemsExpanded.indexOf(i.name) === -1) {
            return false;
          }
          return true;
        })
        .map(s => s.name.toString())
      : [];
    if (streamNames.length) {
      if (this.runtimeStreamStatusesSubscription) {
        this.runtimeStreamStatusesSubscription.unsubscribe();
      }
      this.runtimeStreamStatusesSubscription = this.streamsService.getRuntimeStreamStatuses(streamNames)
        .subscribe(metrics => {
          this.streamStatuses = metrics;
        });
    } else {
      this.streamStatuses = [];
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
    this.blockerService.lock();
    this.streamsService
      .undeployDefinition(item)
      .pipe(takeUntil(this.ngUnsubscribe$), finalize(() => this.blockerService.unlock()))
      .subscribe(data => {
        this.notificationService.success(`Successfully undeployed stream definition "${item.name}"`);
      }, () => {
        this.notificationService.error('An error occurred while undeploying Stream. ' +
          'Please check the server logs for more details.');
      });
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
   * @returns {StreamStatuses}
   */
  metricsForStream(name: string): StreamStatuses {
    if (Array.isArray(this.streamStatuses)) {
      return this.streamStatuses.find(m => m.name === name);
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
   * Navigate to the utils streams page
   */
  utils() {
    this.router.navigate(['/streams/utils']);
  }

  /**
   * Navigate to the register app
   */
  registerApps() {
    this.router.navigate(['/apps/add']);
  }

  /**
   * Navigate to the grafana Dashboard
   */
  grafanaDashboard() {
    this.grafanaService.getDashboardStreams().subscribe((url: string) => {
      window.open(url);
    });
  }

  /**
   * Navigate to the grafana stream Dashboard
   * @param streamDefinition
   */
  grafanaStreamDashboard(streamDefinition: StreamDefinition) {
    this.grafanaService.getDashboardStream(streamDefinition).subscribe((url: string) => {
      window.open(url);
    });
  }

}
