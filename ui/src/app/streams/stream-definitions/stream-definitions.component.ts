import { Component, OnInit, ViewChild } from '@angular/core';
import { Page } from '../../shared/model';
import { StreamDefinition } from '../model/stream-definition';
import { StreamsService } from '../streams.service';
import { ModalDirective} from 'ngx-bootstrap/modal';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { Subscription } from 'rxjs/Subscription';

import { ToastyService} from 'ng2-toasty';
import { Router } from '@angular/router';

@Component({
  selector: 'app-stream-definitions',
  templateUrl: './stream-definitions.component.html',
})

/**
 * Component that handles the listing and undeploy of stream definitions
 * as well as the routing to other components for detail, deployment and
 * creation of a {@link StreamDefinition}.
 *
 * @author Janne Valkealahti
 * @author Gunnar Hillert
 * @author Glenn Renfro
 */
export class StreamDefinitionsComponent implements OnInit {

  streamDefinitions: Page<StreamDefinition>;
  streamDefinitionToDestroy: StreamDefinition;
  busy: Subscription;

  @ViewChild('childPopover')
  public childPopover: PopoverDirective;

  @ViewChild('childModal')
  public childModal: ModalDirective;

  constructor(
    public streamsService: StreamsService,
    private toastyService: ToastyService,
    private router: Router) {
  }

  /**
   * Retrieves the {@link StreamDefinition}s to be displayed on the page.
   */
  ngOnInit() {
    this.loadStreamDefinitions();
  }

  /**
   * Initializes the streamDefinitions attribute with the results from Spring Cloud Data Flow server.
   */
  loadStreamDefinitions() {
    console.log('Loading Stream Definitions...', this.streamDefinitions);

    this.busy = this.streamsService.getDefinitions().subscribe(
      data => {
        this.streamDefinitions = data;
        this.toastyService.success('Stream definitions loaded.');
      }
    );
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
    this.streamsService.undeployDefinition(item).subscribe(
      data => {
        this.cancel();
        this.toastyService.success('Successfully undeployed stream definition "'
          + item.name + '"');
      },
      error => {}
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
    this.streamsService.destroyDefinition(streamDefinition).subscribe(
      data => {
        this.cancel();
        this.toastyService.success('Successfully destroyed stream definition "'
          + streamDefinition.name + '"');
      },
      error => {}
    );
  }

  /**
   * Hides the modal dialog box.
   */
  public cancel = function() {
    this.hideChildModal();
  };

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
   * Hides the help page describing stream status.
   */
  closePopOver() {
    this.childPopover.hide();
  }
}
