import {Component, OnInit, ViewChild} from '@angular/core';
import {Stream, StreamHistory} from '../../../shared/model/stream.model';
import {ActivatedRoute, Router} from '@angular/router';
import {StreamService} from '../../../shared/api/stream.service';
import {mergeMap} from 'rxjs/operators';
import {HttpError} from '../../../shared/model/error.model';
import {NotificationService} from '../../../shared/service/notification.service';
import {DestroyComponent} from '../destroy/destroy.component';
import {UndeployComponent} from '../undeploy/undeploy.component';
import get from 'lodash.get';
import {StreamStatus} from '../../../shared/model/metrics.model';
import {RollbackComponent} from '../rollback/rollback.component';
import {ScaleComponent} from '../scale/scale.component';
import {TranslateService} from '@ngx-translate/core';

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
  loadingApps = true;
  stream: Stream;
  applications: Array<any>;
  streamsRelated: Stream[];
  logs: any;
  runtime: StreamStatus;
  history: StreamHistory[];
  isLogOpen = false;
  log: any;

  @ViewChild('destroyModal', {static: true}) destroyModal: DestroyComponent;
  @ViewChild('undeployModal', {static: true}) undeployModal: UndeployComponent;
  @ViewChild('rollbackModal', {static: true}) rollbackModal: RollbackComponent;
  @ViewChild('scaleModal', {static: true}) scaleModal: ScaleComponent;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private notificationService: NotificationService,
    private streamService: StreamService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.route.params
      .pipe(
        mergeMap(params => {
          this.stream = new Stream();
          this.stream.name = params.name;
          return this.streamService.getStream(params.name);
        })
      )
      .subscribe(
        (stream: Stream) => {
          this.stream = stream;
          this.getApplications();
          this.getStreamsRelated();
          if (this.canShowDeploymentInfo()) {
            this.getDeploymentInfo();
            this.getRuntimeStreamStatuses();
          }
          this.getHistory();
          this.loading = false;
        },
        error => {
          this.notificationService.error(this.translate.instant('commons.message.error'), error);
          if (HttpError.is404(error)) {
            this.back();
          }
        }
      );
  }

  getApplications(): void {
    this.loadingApps = true;
    this.streamService.getApplications(this.stream.name).subscribe(
      (apps: any[]) => {
        this.applications = apps;
        this.loadingApps = false;
      },
      error => {
        // Error: TODO
        this.loadingApps = false;
      }
    );
  }

  canShowDeploymentInfo(): boolean {
    return (
      (this.stream && this.stream.status === 'DEPLOYED') ||
      this.stream.status === 'DEPLOYING' ||
      this.stream.status === 'FAILED' ||
      this.stream.status === 'INCOMPLETE'
    );
  }

  getDeploymentInfo(): void {
    this.loadingDeploymentInfo = true;
    this.streamService.getDeploymentInfo(this.stream.name).subscribe(
      (stream: Stream) => {
        this.stream.deploymentProperties = stream.deploymentProperties;
        this.loadingDeploymentInfo = false;
      },
      error => {
        // Error: TODO
        this.loadingDeploymentInfo = false;
      }
    );
  }

  getLogs(): void {
    this.loadingLogs = true;
    this.streamService.getLogs(this.stream.name).subscribe(
      (data: any) => {
        this.logs = get(data, 'logs', {});
        if (get(this.log, 'name')) {
          this.log.log = get(this.logs, this.log.name);
        }
        this.loadingLogs = false;
      },
      error => {
        // Error: TODO
        this.loadingLogs = false;
      }
    );
  }

  getRuntimeStreamStatuses(): void {
    this.loadingRuntime = true;
    this.streamService.getRuntimeStreamStatuses([this.stream.name]).subscribe(
      (data: StreamStatus[]) => {
        // this.logs = get(data, 'logs', {});
        this.runtime = data[0];
        this.loadingRuntime = false;
      },
      error => {
        // Error: TODO
        this.loadingRuntime = false;
      }
    );
  }

  getHistory(): void {
    this.loadingHistory = true;
    this.streamService.getStreamHistory(this.stream.name).subscribe(
      (history: StreamHistory[]) => {
        // this.logs = get(data, 'logs', {});
        this.loadingHistory = false;
        this.history = history;
      },
      error => {
        this.loadingHistory = false;
        this.history = [];
      }
    );
  }

  getStreamsRelated(): void {
    this.loadingStreamsRelated = true;
    this.streamService.getStreamsRelated(this.stream.name, true).subscribe(
      (streams: Stream[]) => {
        this.streamsRelated = streams;
        this.loadingStreamsRelated = false;
      },
      error => {
        // Error: TODO
        this.loadingStreamsRelated = false;
      }
    );
  }

  getAppType(key: string): string {
    const app = this.applications.find(it => it.label === key);
    return app?.type;
  }

  getOrigin(key: string): string {
    const app = this.applications.find(it => it.label === key);
    return app?.name;
  }

  destroy(): void {
    this.destroyModal.open([this.stream]);
  }

  deploy(): void {
    this.router.navigateByUrl(`streams/list/${this.stream.name}/deploy`);
  }

  scale(): void {
    this.scaleModal.open(this.stream.name);
  }

  undeploy(): void {
    this.undeployModal.open([this.stream]);
  }

  canRollback(history: StreamHistory): boolean {
    return (
      this.stream.status.toLocaleLowerCase() === 'deployed' && history.statusCode.toLocaleLowerCase() !== 'deployed'
    );
  }

  hasLog(name: string): boolean {
    if (get(this.logs, name) && get(this.log, 'log')) {
      return true;
    }
    return false;
  }

  showLog(name: string, type: string): void {
    this.getLogs();
    this.log = {
      name,
      type,
      log: null
    };
    this.isLogOpen = true;
  }

  rollback(history: StreamHistory): void {
    this.rollbackModal.open(history);
  }

  back(): void {
    this.router.navigateByUrl('streams/list');
  }
}
