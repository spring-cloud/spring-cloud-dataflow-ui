import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { ActivatedRoute } from '@angular/router';
import { mergeMap, map, catchError } from 'rxjs/operators';
import { StreamsService } from '../streams.service';
import { Observable, EMPTY } from 'rxjs';
import { StreamDefinition } from '../model/stream-definition';
import { AppError, HttpAppError } from '../../shared/model/error.model';
import { Router } from '@angular/router';
import { LoggerService } from '../../shared/services/logger.service';
import { StreamsDestroyComponent } from '../streams-destroy/streams-destroy.component';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { NotificationService } from '../../shared/services/notification.service';
import { SharedAboutService } from '../../shared/services/shared-about.service';
import { GrafanaService } from '../../shared/grafana/grafana.service';

/**
 * Component that shows the details of a Stream Definition
 *
 * @author Janne Valkealahti
 * @author Gunnar Hillert
 * @author Glenn Renfro
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-stream',
  templateUrl: 'stream.component.html',
  styleUrls: ['styles.scss'],
  encapsulation: ViewEncapsulation.None
})

export class StreamComponent implements OnInit {

  /**
   * Observable of StreamDefinition
   */
  streamDefinition$: Observable<any>;

  /**
   * Modal
   */
  modal: BsModalRef;

  constructor(private route: ActivatedRoute,
              private streamsService: StreamsService,
              private loggerService: LoggerService,
              private router: Router,
              private modalService: BsModalService,
              private notificationService: NotificationService,
              private sharedAboutService: SharedAboutService,
              private grafanaService: GrafanaService,
              private routingStateService: RoutingStateService) {
  }

  /**
   * Initialiaze component
   */
  ngOnInit() {
    this.streamDefinition$ = this.route.params
      .pipe(
        mergeMap(
          (val) => this.sharedAboutService.getFeatureInfo()
            .pipe(map((featureInfo) => {
              return {
                id: val.id,
                featureInfo: featureInfo
              };
            }))
        ),
        mergeMap(
          (val) => this.grafanaService.isAllowed()
            .pipe(map((active: boolean) => {
              return {
                id: val.id,
                featureInfo: val.featureInfo,
                grafanaEnabled: active
              };
            }))
        ),
        mergeMap(
          (val) => this.streamsService.getDefinition(val.id)
            .pipe(map((streamDefinition: StreamDefinition) => {
              return {
                id: val.id,
                featureInfo: val.featureInfo,
                grafanaEnabled: val.grafanaEnabled,
                streamDefinition: streamDefinition
              };
            }))
        ),
        catchError((error) => {
          if (HttpAppError.is404(error)) {
            this.cancel();
          }
          this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
          return EMPTY;
        })
      );
  }

  /**
   * Undeploy the stream
   *
   * @param {StreamDefinition} streamDefinition
   */
  undeploy(streamDefinition: StreamDefinition) {
    this.loggerService.log(`Undeploy ${streamDefinition.name} stream definition(s).`, streamDefinition);
    this.streamsService
      .undeployDefinition(streamDefinition)
      .subscribe(() => {
        this.notificationService.success(`Successfully undeployed stream definition "${streamDefinition.name}"`);
        this.ngOnInit();
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
    this.loggerService.log(`Destroy ${name} stream definition.`, name);
    this.modal = this.modalService.show(StreamsDestroyComponent, { class: 'modal-md' });
    this.modal.content.open({ streamDefinitions: [streamDefinition] }).subscribe(() => {
      this.cancel();
    });
  }

  /**
   * Navigate to the grafana Dashboard
   * @param streamDefinition
   */
  grafanaDashboard(streamDefinition: StreamDefinition) {
    this.grafanaService.getDashboardStream(streamDefinition).subscribe((url: string) => {
      window.open(url);
    });
  }

  /**
   * Back action
   * Navigate to the previous URL or /streams/definitions
   */
  cancel() {
    this.routingStateService.back('/streams/definitions', /^(\/streams\/definitions\/)/);
  }


}
