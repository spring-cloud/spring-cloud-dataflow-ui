import { Component, OnInit, ViewChild } from '@angular/core';
import { Stream, StreamHistory } from '../../../shared/model/stream.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { StreamService } from '../../../shared/api/stream.service';
import { mergeMap } from 'rxjs/operators';
import { HttpError } from '../../../shared/model/error.model';
import { NotificationService } from '../../../shared/service/notification.service';
import { DestroyComponent } from '../destroy/destroy.component';
import { UndeployComponent } from '../undeploy/undeploy.component';
import { Parser } from '../../../flo/shared/service/parser';
import get from 'lodash.get';
import set from 'lodash.set';
import { StreamStatus, StreamStatuses } from '../../../shared/model/metrics.model';
import { MetamodelService } from '../../../flo/stream/metamodel.service';
import { RenderService } from '../../../flo/stream/render.service';

@Component({
  selector: 'app-stream',
  templateUrl: './stream.component.html',
  styles: []
})
export class StreamComponent implements OnInit {

  loading = true;
  loadingRuntime = true;
  loadingLogs = true;
  loadingDeploymentInfo = true;
  loadingHistory = true;
  loadingStreamsRelated = true;
  stream: Stream;
  applications: Array<any>;
  streamsRelated: Stream[];
  logs: any;
  runtime: StreamStatus;
  history: StreamHistory[];
  isLogOpen = false;
  log: any;

  @ViewChild('destroyModal', { static: true }) destroyModal: DestroyComponent;
  @ViewChild('undeployModal', { static: true }) undeployModal: UndeployComponent;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private notificationService: NotificationService,
              public metamodelService: MetamodelService,
              public renderService: RenderService,
              private streamService: StreamService) {
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.route.params
      .pipe(
        mergeMap(params => {
            this.stream = new Stream();
            this.stream.name = params.name;
            return this.streamService.getStream(params.name);
          }
        )
      )
      .subscribe((stream: Stream) => {
        this.stream = stream;
        this.applications = this.parseApplications(this.stream.dslText);
        this.getStreamsRelated();
        if (this.canShowDeploymentInfo()) {
          this.getDeploymentInfo();
          this.getRuntimeStreamStatuses();
          this.getLogs();
        }
        this.getHistory();
        this.loading = false;
      }, (error) => {
        this.notificationService.error('An error occurred', error);
        if (HttpError.is404(error)) {
          this.back();
        }
      });
  }

  parseApplications(dsl: string) {
    const parser = Parser.parse(dsl, 'stream');
    return parser.lines[0].nodes
      .map((node) => {
        return {
          origin: get(node, 'name'),
          name: get(node, 'label') || get(node, 'name'),
          type: get(node, 'type', '').toString()
        };
      });
  }

  canShowDeploymentInfo() {
    return this.stream && (
      this.stream.status === 'DEPLOYED'
      || this.stream.status === 'DEPLOYING'
      || this.stream.status === 'FAILED'
      || this.stream.status === 'INCOMPLETE'
    );
  }

  getDeploymentInfo() {
    this.loadingDeploymentInfo = true;
    this.streamService.getDeploymentInfo(this.stream.name)
      .subscribe((stream: Stream) => {
        this.stream.deploymentProperties = stream.deploymentProperties;
        this.loadingDeploymentInfo = false;
      }, (error) => {
        // Error: TODO
        this.loadingDeploymentInfo = false;
      });
  }

  getLogs() {
    this.loadingLogs = true;
    this.streamService.getLogs(this.stream.name)
      .subscribe((data: any) => {
        this.logs = get(data, 'logs', {});
        this.loadingLogs = false;
      }, (error) => {
        // Error: TODO
        this.loadingLogs = false;
      });
  }

  getRuntimeStreamStatuses() {
    this.loadingRuntime = true;
    this.streamService.getRuntimeStreamStatuses([this.stream.name])
      .subscribe((data: StreamStatus[]) => {
        // this.logs = get(data, 'logs', {});
        this.runtime = data[0];
        this.loadingRuntime = false;
      }, (error) => {
        // Error: TODO
        this.loadingRuntime = false;
      });
  }

  getHistory() {
    this.loadingHistory = true;
    this.streamService.getStreamHistory(this.stream.name)
      .subscribe((history: StreamHistory[]) => {
        // this.logs = get(data, 'logs', {});
        this.loadingHistory = false;
        this.history = history;
      }, (error) => {
        // Error: TODO
        this.loadingRuntime = false;
      });
  }

  getStreamsRelated() {
    this.loadingStreamsRelated = true;
    this.streamService.getStreamsRelated(this.stream.name, true)
      .subscribe((streams: Stream[]) => {
        this.streamsRelated = streams;
        this.loadingStreamsRelated = false;
      }, (error) => {
        // Error: TODO
        this.loadingStreamsRelated = false;
      });
  }

  getAppType(key: string) {
    const appRef = this.applications.find(app => app.name === key);
    return get(appRef, 'type', '');
  }

  getOrigin(key: string) {
    const appRef = this.applications.find(app => app.name === key);
    return get(appRef, 'origin', '');
  }

  destroy() {
    this.destroyModal.open([this.stream]);
  }

  deploy() {
    this.router.navigateByUrl(`streams/list/${this.stream.name}/deploy`);
  }

  undeploy() {
    this.undeployModal.open([this.stream]);
  }

  canRollback(history: StreamHistory): boolean {
    return this.stream.status.toLocaleLowerCase() === 'deployed' && history.statusCode.toLocaleLowerCase() !== 'deployed';
  }

  hasLog(name: string) {
    if (get(this.logs, name)) {
      return true;
    }
    return false;
  }

  showLog(name: string, type) {
    this.log = {
      name,
      type,
      log: get(this.logs, name)
    };
    this.isLogOpen = true;
  }

  rollback(history: StreamHistory) {

  }

  back() {
    this.router.navigateByUrl('streams/list');
  }
}
