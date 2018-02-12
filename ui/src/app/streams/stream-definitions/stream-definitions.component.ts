import {Component, OnInit, OnDestroy, ViewChild, ViewEncapsulation} from '@angular/core';
import {Page} from '../../shared/model';
import {StreamDefinition} from '../model/stream-definition';
import {StreamsService} from '../streams.service';
import {ModalDirective} from 'ngx-bootstrap/modal';
import {PopoverDirective} from 'ngx-bootstrap/popover';
import {Subscription} from 'rxjs/Subscription';
import {IntervalObservable} from 'rxjs/observable/IntervalObservable';
import {StreamMetrics} from '../model/stream-metrics';

import {ToastyService} from 'ng2-toasty';
import {Router} from '@angular/router';
import {BsModalRef, BsModalService} from 'ngx-bootstrap';
import {StreamDeployMultiComponent} from '../stream-deploy-multi/stream-deploy-multi.component';
import { BusyService } from '../../shared/services/busy.service';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-stream-definitions',
  templateUrl: './stream-definitions.component.html',
  styleUrls: ['./stream-definitions.component.scss'],
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
export class StreamDefinitionsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();

  streamDefinitions: Page<StreamDefinition>;
  streamDefinitionToDestroy: StreamDefinition;
  metricsSubscription: Subscription;
  definitionNameSort: boolean = undefined;
  definitionSort: boolean = undefined;
  metrics: StreamMetrics[];

  streamDefinitionsToDestroy: StreamDefinition[];
  streamDefinitionsToDeploy: StreamDefinition[];
  streamDefinitionsToUndeploy: StreamDefinition[];

  selectStreamDefinition: StreamDefinition;

  @ViewChild('destroyMultipleStreamDefinitionsModal')
  public destroyMultipleStreamDefinitionsModal: ModalDirective;

  @ViewChild('undeployMultipleStreamDefinitionsModal')
  public undeployMultipleStreamDefinitionsModal: ModalDirective;

  @ViewChild('childPopover')
  public childPopover: PopoverDirective;

  @ViewChild('childModal')
  public childModal: ModalDirective;

  modal: BsModalRef;

  constructor(public streamsService: StreamsService,
              private busyService: BusyService,
              private toastyService: ToastyService,
              private modalService: BsModalService,
              private router: Router) {
  }

  /**
   * Retrieves the {@link StreamDefinition}s to be displayed on the page.
   */
  ngOnInit() {
    this.loadStreamDefinitions();
    this.metricsSubscription = IntervalObservable.create(2000)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(() => this.loadStreamMetrics());
  }

  /**
   * Will cleanup any {@link Subscription}s to prevent
   * memory leaks.  
   */
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Initializes the streamDefinitions attribute with the results from Spring Cloud Data Flow server.
   */
  loadStreamDefinitions() {
    console.log('Loading Stream Definitions...', this.streamDefinitions);
    const subscription = this.streamsService.getDefinitions(this.definitionNameSort, this.definitionSort)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(
      data => {
        this.streamDefinitions = data;
        this.toastyService.success('Stream definitions loaded.');
      }
    );
    this.busyService.addSubscription(subscription);
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
      this.streamsService.metrics(streamNames)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(metrics => this.metrics = metrics);
    } else {
      this.metrics = [];
    }
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
    this.streamsService.streamDefinitions.pageNumber = page - 1;
    this.loadStreamDefinitions();
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
    this.streamsService.undeployDefinition(item)
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe(
      data => {
        this.cancel();
        this.toastyService.success('Successfully undeployed stream definition "'
          + item.name + '"');
      },
      error => {
        this.toastyService.error(error);
      }
    );
  }

  /**
   * Route to stream deployment page.
   * @param item the stream definition to be deployed.
   */
  deploy(item: StreamDefinition) {
    this.router.navigate(['streams/definitions/' + item.name + '/deploy']);
  }

  /**
   * Removes the {@link StreamDefinition} from the repository.  Shows modal dialog
   * prior to deletion to verify if user wants to destroy definition.
   * @param item the stream definition to be removed.
   */
  destroy(item: StreamDefinition) {
    this.streamDefinitionToDestroy = item;
    this.showChildModal();
  }

  /**
   * Toggles definition name sort and updates table.
   */
  toggleDefinitionNameSort() {
    if (this.definitionNameSort === undefined) {
      this.definitionNameSort = true;
    } else if (this.definitionNameSort) {
      this.definitionNameSort = false;
    } else {
      this.definitionNameSort = undefined;
    }
    this.loadStreamDefinitions();
  }

  /**
   * Toggles definition sort and updates table.
   */
  toggleDefinitionSort() {
    if (this.definitionSort === undefined) {
      this.definitionSort = true;
    } else if (this.definitionSort) {
      this.definitionSort = false;
    } else {
      this.definitionSort = undefined;
    }
    this.loadStreamDefinitions();
  }

  /**
   * Displays modal dialog box that confirms the user wants to destroy a {@link StreamDefinition}.
   */
  public showChildModal(): void {
    this.childModal.show();
  }

  /**
   *  Hides the modal dialog box that confirms whether the user wants to
   *  destroy a {@link StreamDefinition}.
   */
  public hideChildModal(): void {
    this.childModal.hide();
  }

  /**
   * The method that calls the service to delete the {@link StreamDefinition}.
   * Upon completion of the delete the modal dialog box is hidden.
   * @param streamDefinition the stream definition to destroy.
   */
  public proceed(streamDefinition: StreamDefinition): void {
    console.log('Proceeding to destroy definition...', streamDefinition);
    this.streamsService.destroyDefinition(streamDefinition)
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe(
      data => {
        this.cancel();
        this.toastyService.success('Successfully destroyed stream definition "'
          + streamDefinition.name + '"');
      },
      error => {
        this.toastyService.error(error);
      }
    );
  }

  /**
   * Hides the modal dialog box.
   */
  public cancel() {
    this.hideChildModal();
  }

  /**
   * Close the confirmation modal dialog for
   * destroy multiple Stream Definitions {@link StreamDefinition}s.
   */
  public cancelDestroyMultipleStreamDefinitions() {
    this.destroyMultipleStreamDefinitionsModal.hide();
  }

  /**
   * Close the confirmation modal dialog for
   * undeploy multiple Stream Definitions {@link StreamDefinition}s.
   */
  public cancelUndeployMultipleStreamDefinitions() {
    this.undeployMultipleStreamDefinitionsModal.hide();
  }

  /**
   * Expands all definition entries to show flo diagram on list page.
   */
  expandPage() {
    console.log('Expand all.');
    this.streamDefinitions.items.map(x => {
      console.log(x);
      x.isExpanded = true;
    });
  }

  /**
   * Collapses all definition entries to hid the flow diagrams on list page.
   */
  collapsePage() {
    console.log('Collapse all.');
    this.streamDefinitions.items.map(x => {
      console.log(x);
      x.isExpanded = false;
    });
  }

  /**
   * Starts the destroy process of multiple {@link StreamDefinition}s
   * by opening a confirmation modal dialog.
   *
   * @param streamDefinitions An array of StreamDefinition to destroy
   */
  destroyMultipleStreams(streamDefinitions: StreamDefinition[]) {
    this.streamDefinitionsToDestroy = streamDefinitions.filter(item => item.isSelected);
    if (this.streamDefinitionsToDestroy.length === 0) {
      return;
    }
    console.log(`Destroy ${this.streamDefinitionsToDestroy.length} stream definition(s).`, this.streamDefinitionsToDestroy);
    this.destroyMultipleStreamDefinitionsModal.show();
  }

  /**
   * Starts the deploy process of multiple {@link StreamDefinition}s
   * by opening a confirmation modal dialog.
   *
   * @param streamDefinitions An array of StreamDefinition to deploy
   */
  deployMultipleStreamDefinitions(streamDefinitions: StreamDefinition[]) {
    this.selectStreamDefinition = null;
    this.streamDefinitionsToDeploy = streamDefinitions
      .filter(item => item.isSelected && this.filterDeployable(item))
      .map(item => {
        item.deploymentProperties = {};
        return item;
      });
    if (this.streamDefinitionsToDeploy.length === 0) {
      return;
    }

    console.log(`Deploy ${this.streamDefinitionsToDeploy.length} stream definition(s).`, this.streamDefinitionsToDeploy);

    this.modal = this.modalService.show(StreamDeployMultiComponent);
    this.modal.content.streamDefinitions = this.streamDefinitionsToDeploy;
    this.modal.content.confirm
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe((data) => {
      this.toastyService.success(`${data.length} stream definition(s) deployed.`);
      const busy = this.streamsService
        .getDefinitions(this.definitionNameSort, this.definitionSort)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe();
      this.busyService.addSubscription(busy);
    });
  }

  /**
   * Starts the undeploy process of multiple {@link StreamDefinition}s
   * by opening a confirmation modal dialog.
   *
   * @param streamDefinitions An array of StreamDefinition to undeploy
   */
  undeployMultipleStreamDefinitions(streamDefinitions: StreamDefinition[]) {
    this.streamDefinitionsToUndeploy = streamDefinitions
      .filter(item => item.isSelected && this.filterUndeployable(item));

    if (this.streamDefinitionsToUndeploy.length === 0) {
      return;
    }
    console.log(`Undeploy ${this.streamDefinitionsToUndeploy.length} stream definition(s).`, this.streamDefinitionsToUndeploy);
    this.undeployMultipleStreamDefinitionsModal.show();
  }

  /**
   * Applies the destroy process of multiple {@link StreamDefinition}s
   *
   * @param streamDefinitions An array of StreamDefinition to destroy
   */
  proceedToDestroyMultipleStreamDefinitions(streamDefinitions: StreamDefinition[]) {
    console.log(`Proceeding to destroy ${streamDefinitions.length} stream definition(s).`, streamDefinitions);
    const subscription = this.streamsService.destroyMultipleStreamDefinitions(streamDefinitions)
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe(
      data => {
        this.toastyService.success(`${data.length} stream definition(s) destroy.`);
        if (this.streamsService.streamDefinitions.items.length === 0 && this.streamsService.streamDefinitions.pageNumber > 0) {
          this.streamDefinitions.pageNumber = this.streamDefinitions.pageNumber - 1;
        }
        const busy = this.streamsService
          .getDefinitions(this.definitionNameSort, this.definitionSort)
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe();
        this.busyService.addSubscription(busy);
      }
    );
    this.busyService.addSubscription(subscription);
    this.cancelDestroyMultipleStreamDefinitions();
  }

  /**
   * Applies the undeploy process of multiple {@link StreamDefinition}s
   *
   * @param streamDefinitions An array of StreamDefinition to undeploy
   */
  proceedToUndeployMultipleStreamDefinitions(streamDefinitions: StreamDefinition[]) {
    console.log(`Proceeding to undeploy ${streamDefinitions.length} stream definition(s).`, streamDefinitions);
    const subscription = this.streamsService.undeployMultipleStreamDefinitions(streamDefinitions).subscribe(
      data => {
        this.toastyService.success(`${data.length} stream definition(s) undeploy.`);
        const busy = this.streamsService
          .getDefinitions(this.definitionNameSort, this.definitionSort)
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe();
        this.busyService.addSubscription(busy);
      }
    );
    this.busyService.addSubscription(subscription);
    this.cancelUndeployMultipleStreamDefinitions();
  }

  filterUndeployable(item: any) {
    return !(item.status === 'undeployed' || item.status === 'incomplete');
  }

  filterDeployable(item: any) {
    return !(item.status === 'deployed' || item.status === 'deploying');
  }

  /**
   * Hides the help page describing stream status.
   */
  closePopOver() {
    this.childPopover.hide();
  }

  metricsForStream(name: string): StreamMetrics {
    if (Array.isArray(this.metrics)) {
      return this.metrics.find(m => m.name === name);
    }
  }

  canShowDeploymentInfo(item: StreamDefinition) {
    return item.status === 'deployed'
      || item.status === 'deploying'
      || item.status === 'failed'
      || item.status === 'incomplete';
  }

}
