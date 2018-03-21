import {Component, OnInit, OnDestroy, ViewEncapsulation} from '@angular/core';
import {Page} from '../../shared/model';
import {StreamDefinition} from '../model/stream-definition';
import {StreamsService} from '../streams.service';
import {Subscription} from 'rxjs/Subscription';
import {StreamMetrics} from '../model/stream-metrics';
import {Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {StreamsDeployComponent} from '../streams-deploy/streams-deploy.component';
import {StreamsUndeployComponent} from '../streams-undeploy/streams-undeploy.component';
import {StreamsDestroyComponent} from '../streams-destroy/streams-destroy.component';
import {ToastyService} from 'ng2-toasty';
import {SortParams, OrderParams} from '../../shared/components/shared.interface';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';
import {StreamListParams} from '../components/streams.interface';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/operators';
import {BusyService} from '../../shared/services/busy.service';

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
   * Initialize component
   *
   * @param {StreamsService} streamsService
   * @param {BsModalService} modalService
   * @param {BusyService} busyService
   * @param {ToastyService} toastyService
   * @param {Router} router
   */
  constructor(public streamsService: StreamsService,
              private modalService: BsModalService,
              private busyService: BusyService,
              private toastyService: ToastyService,
              private router: Router) {
  }

  /**
   * Retrieves the {@link StreamDefinition}s to be displayed on the page.
   */
  ngOnInit() {
    this.context = this.streamsService.streamsContext;
    this.params = {...this.context};
    this.form = {q: this.context.q, checkboxes: [], checkboxesExpand: []};
    this.itemsSelected = this.context.itemsSelected || [];
    this.itemsExpanded = this.context.itemsExpanded || [];
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
    console.log('Loading Stream Definitions...', this.params);
    const busy = this.streamsService
      .getDefinitions(this.params).map((page: Page<StreamDefinition>) => {
        this.form.checkboxes = page.items.map((stream) => {
          return this.itemsSelected.indexOf(stream.name) > -1;
        });
        this.form.checkboxesExpand = page.items.map((stream) => {
          return this.itemsExpanded.indexOf(stream.name) > -1;
        });
        return page;
      })
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((page: Page<StreamDefinition>) => {
          if (page.items.length === 0 && this.params.page > 0) {
            this.params.page = 0;
            this.refresh();
            return;
          }
          this.streamDefinitions = page;
          this.changeExpand();
          this.changeCheckboxes();
          this.updateContext();
        },
        error => {
          this.toastyService.error(error);
        }
      );

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
  search() {
    this.params.q = this.form.q;
    this.params.page = 0;
    this.refresh();
  }

  /**
   * Used to determinate the state of the query parameters
   *
   * @returns {boolean} Search is active
   */
  isSearchActive() {
    return (this.form.q !== this.params.q);
  }

  /**
   * Reset the search parameters and run the search
   */
  clearSearch() {
    this.form.q = '';
    this.search();
  }

  /**
   * Determine if there is no application
   */
  isAppsEmpty(): boolean {
    if (this.streamDefinitions) {
      if (this.streamDefinitions.totalPages < 2) {
        return (this.params.q === '' && this.streamDefinitions.items.length === 0);
      }
    }
    return false;
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
      this.streamsService.metrics(streamNames).subscribe(metrics => this.metrics = metrics);
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
    console.log('Expand all.');
    this.form.checkboxesExpand = this.streamDefinitions.items.map(() => true);
    this.changeExpand();
  }

  /**
   * Collapses all definition entries to hid the flow diagrams on list page.
   */
  collapsePage() {
    console.log('Collapse all.');
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
   * Used for requesting a new page. The past is page number is
   * 1-index-based. It will be converted to a zero-index-based
   * page number under the hood.
   *
   * @param page 1-index-based
   */
  getPage(page: number) {
    console.log(`Getting page ${page}.`);
    this.params.page = page - 1;
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
        this.toastyService.success(`Successfully undeployed stream definition "${item.name}"`);
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
    console.log(`Destroy ${streamDefinitions} stream definition(s).`, streamDefinitions);
    const className = streamDefinitions.length > 1 ? 'modal-lg' : 'modal-md';
    this.modal = this.modalService.show(StreamsDestroyComponent, {class: className});
    this.modal.content.open({streamDefinitions: streamDefinitions}).subscribe(() => {
      if (this.streamsService.streamDefinitions.items.length === 0 &&
        this.streamsService.streamDefinitions.pageNumber > 0) {
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
    console.log(`Deploy ${streamDefinitions.length} stream definition(s).`, streamDefinitions);
    this.modal = this.modalService.show(StreamsDeployComponent, {class: 'modal-xl'});
    this.modal.content.open({streamDefinitions: streamDefinitions}).subscribe(() => {
      this.refresh();
    });
  }

  /**
   * Starts the undeploy process of multiple {@link StreamDefinition}s
   * by opening a confirmation modal dialog.
   */
  undeployStreams(streamDefinitions: StreamDefinition[]) {
    if (streamDefinitions.length === 0) {
      return;
    }
    console.log(`Undeploy ${streamDefinitions.length} stream definition(s).`, streamDefinitions);
    this.modal = this.modalService.show(StreamsUndeployComponent, {class: 'modal-lg'});
    this.modal.content.open({streamDefinitions: streamDefinitions}).subscribe(() => {
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

}
