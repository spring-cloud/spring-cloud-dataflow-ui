import { Component, OnInit } from '@angular/core';
import { StreamsService } from '../../streams.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { mergeMap } from 'rxjs/operators';
import { StreamDefinition } from '../../model/stream-definition';
import { Observable } from 'rxjs/Observable';
import { Parser } from '../../../shared/services/parser';
import { StreamsDestroyComponent } from '../../streams-destroy/streams-destroy.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ToastyService } from 'ng2-toasty';

/**
 * Component that shows the summary details of a Stream Definition
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-stream-summary',
  templateUrl: 'stream-summary.component.html',
  styleUrls: ['../styles.scss'],
})
export class StreamSummaryComponent implements OnInit {

  /**
   * Observable of stream information
   * Contains the stream definition, a list of the streams"s apps
   */
  stream$: Observable<any>;

  /**
   * Modal reference
   */
  modal: BsModalRef;

  /**
   * Constructor
   *
   * @param {ActivatedRoute} route
   * @param {BsModalService} modalService
   * @param {ToastyService} toastyService
   * @param {Router} router
   * @param {StreamsService} streamsService
   */
  constructor(private route: ActivatedRoute,
              private modalService: BsModalService,
              private toastyService: ToastyService,
              private router: Router,
              private streamsService: StreamsService) {
  }

  /**
   * Init component, call refresh method
   */
  ngOnInit() {
    this.refresh();
  }

  /**
   * Refresh
   * Create an observable which provides the required data
   */
  refresh() {
    this.stream$ = this.route.parent.params
      .pipe(mergeMap(
        val => this.streamsService.getDefinition(val.id),
        (val1: Params, val2: StreamDefinition) => val2
      ))
      .pipe(mergeMap(
        val => Observable.of(Parser.parse(val.dslText as string, 'stream')),
        (val1: StreamDefinition, val2: any) => ({
          streamDefinition: val1,
          apps: val2.lines[0].nodes
            .map((node) => (
              {
                origin: node['name'],
                name: node['label'] || node['name'],
                type: node.type.toString()
              }
            ))
        })
      ));
  }

  /**
   * Undeploy the stream
   *
   * @param {StreamDefinition} streamDefinition
   */
  undeploy(streamDefinition: StreamDefinition) {
    console.log(`Undeploy ${streamDefinition.name} stream definition(s).`, streamDefinition);
    this.streamsService
      .undeployDefinition(streamDefinition)
      .subscribe(() => {
        this.toastyService.success(`Successfully undeployed stream definition "${streamDefinition.name}"`);
        this.refresh();
      });
  }

  /**
   * Deploy the stream, navigation to the dedicate page
   *
   * @param {StreamDefinition} streamDefinition
   */
  deploy(streamDefinition: StreamDefinition) {
    this.router.navigate([`streams/definitions/${streamDefinition.name}/deploy`]);
  }

  /**
   * Destroy the stream
   *
   * @param {StreamDefinition} streamDefinition
   */
  destroy(streamDefinition: StreamDefinition) {
    console.log(`Destroy ${name} stream definition.`, name);
    this.modal = this.modalService.show(StreamsDestroyComponent, { class: 'modal-md' });
    this.modal.content.open({ streamDefinitions: [streamDefinition] }).subscribe(() => {
      this.router.navigate([`streams`]);
    });
  }

}
