import { Component, OnInit, ViewChild } from '@angular/core';
import { Page } from '../../shared/model/page';
import { StreamDefinition } from '../model/stream-definition';
import { StreamsService } from '../streams.service';
import { Observable } from 'rxjs/Observable';
import { ModalDirective} from 'ngx-bootstrap/modal';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { Subscription } from 'rxjs/Subscription';

import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { PaginationInstance } from 'ngx-pagination'


@Component({
  selector: 'app-stream-definitions',
  templateUrl: './stream-definitions.component.html',
})

export class StreamDefinitionsComponent implements OnInit {

  streamDefinitions: Page<StreamDefinition>;
  streamDefinitionToDestroy: StreamDefinition;
  busy: Subscription;

  @ViewChild('childPopover')
  public childPopover:PopoverDirective;

  @ViewChild('childModal')
  public childModal:ModalDirective;

  constructor(
    public streamsService: StreamsService,
    private toastyService: ToastyService,
    private router: Router) {
  }

  ngOnInit() {
    this.loadStreamDefinitions();
  }

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
    console.log(`Getting page ${page}.`)
    this.streamsService.streamDefinitions.pageNumber = page-1;
    this.loadStreamDefinitions();
  }

  details(item:StreamDefinition, index:number) {
    console.log(index, item);
    this.router.navigate(['streams/definitions/' + item.name]);
  }

  undeploy(item:StreamDefinition, index:number) {
    console.log(index, item);
    this.streamsService.undeployDefinition(item).subscribe(
      data => {
        this.cancel();
        this.toastyService.success('Successfully undeployed stream definition "'
          + item.name + '"');
      },
      error => {}
    );
  }

  deploy(item:StreamDefinition, index:number) {
    console.log(index, item);
    this.router.navigate(['streams/definitions/' + item.name + '/deploy']);
  }

  destroy(item:StreamDefinition, index:number) {
    console.log(index, item);
    this.streamDefinitionToDestroy = item;
    this.showChildModal();
  }

  public showChildModal():void {
    this.childModal.show();
  }

  public hideChildModal():void {
    this.childModal.hide();
  }

  public proceed(streamDefinition: StreamDefinition): void {
    console.log('Proceeding to destroy definition...', streamDefinition)
    this.streamsService.destroyDefinition(streamDefinition).subscribe(
      data => {
        this.cancel();
        this.toastyService.success('Successfully destroyed stream definition "'
          + streamDefinition.name + '"');
      },
      error => {}
    );
  }

  public cancel = function() {
    this.hideChildModal();
  };

  expandPage() {
    console.log('Expand all.')
    this.streamDefinitions.items.map(x => {
      console.log(x)
      x.isExpanded = true;
    });
  }

  collapsePage() {
    console.log('Collapse all.')
    this.streamDefinitions.items.map(x => {
      console.log(x);
      x.isExpanded = false;
    });
  }

  closePopOver() {
    this.childPopover.hide();
  }
}
