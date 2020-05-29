import { Subscription, timer } from 'rxjs';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Router } from '@angular/router';
import { StreamService } from '../../shared/api/stream.service';
import { Stream, StreamPage } from '../../shared/model/stream.model';
import { DestroyComponent } from './destroy/destroy.component';
import { UndeployComponent } from './undeploy/undeploy.component';
import { DatagridComponent } from '../../shared/component/datagrid/datagrid.component';
import { ContextService } from '../../shared/service/context.service';
import { MultiDeployComponent } from './multi-deploy/multi-deploy.component';
import { StreamStatus } from '../../shared/model/metrics.model';

@Component({
  selector: 'app-streams-list',
  templateUrl: './streams.component.html',
})
export class StreamsComponent extends DatagridComponent implements OnDestroy, OnInit {
  page: StreamPage;
  expanded: {};
  @ViewChild('destroyModal', { static: true }) destroyModal: DestroyComponent;
  @ViewChild('undeployModal', { static: true }) undeployModal: UndeployComponent;
  @ViewChild('multiDeployModal', { static: true }) multiDeployModal: MultiDeployComponent;

  /**
   * Metrics Subscription
   */
  metricsSubscription: Subscription;

  /**
   * Array of streamStatuses
   */
  streamStatuses: StreamStatus[] = [];

  /**
   * Time Subscription
   */
  timeSubscription: Subscription;

  constructor(private streamService: StreamService,
              protected contextService: ContextService,
              private router: Router) {
    super(contextService, 'streams');
  }

  ngOnInit(): void {
    this.expanded = this.contextService.get('streams.expended') || [];
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    if (this.metricsSubscription) {
      this.metricsSubscription.unsubscribe();
    }
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
    super.ngOnDestroy();
    this.updateContext('expended', this.expanded);
  }

  refresh(state: ClrDatagridStateInterface) {
    if (this.isReady()) {
      super.refresh(state);
      const params = this.getParams(state, { name: '' });
      this.streamService.getStreams(params.current - 1, params.size, params.name || '', `${params.by || ''}`,
        `${params.reverse ? 'DESC' : 'ASC'}`)
        .subscribe((page: StreamPage) => {
          this.attachColumns();
          const mergeExpended = {};
          page.items.forEach((item) => {
            mergeExpended[item.name] = this.expanded[item.name] || false;
          });
          this.expanded = mergeExpended;
          this.page = page;
          this.updateGroupContext(params);
          this.selected = [];
          this.loading = false;

          if (!this.timeSubscription) {
            this.updateMetrics();
            this.timeSubscription = timer(0, 10 * 1000).subscribe(() => this.updateMetrics());
          }
        });
    }
  }

  details(stream: Stream) {
    this.router.navigateByUrl(`streams/list/${stream.name}`);
  }

  deploy(streams: Stream[]) {
    if (streams.length === 1) {
      this.router.navigateByUrl(`streams/list/${streams[0].name}/deploy`);
    } else {
      this.multiDeployModal.open(streams);
    }
  }

  undeploy(streams: Stream[]) {
    this.undeployModal.open(streams);
  }

  destroy(streams: Stream[]) {
    this.destroyModal.open(streams);
  }

  create() {
    this.router.navigateByUrl(`streams/list/create`);
  }

  /**
   * Update the list of selected checkbox
   */
  private updateMetrics() {
    const expandedStreams = this.page.items.filter(s => this.expanded[s.name]);
    if (expandedStreams.length > 0) {
      const deployedStreamNames = expandedStreams
        .filter(s => {
          const status = s.status.toLowerCase();
          return (status === 'deployed') || (status === 'deploying') || (status === 'partial')
        })
        .map(s => s.name.toString());
      if (deployedStreamNames.length) {
        if (this.metricsSubscription) {
          this.metricsSubscription.unsubscribe();
        }
        this.metricsSubscription = this.streamService.getRuntimeStreamStatuses(deployedStreamNames)
          .subscribe(metrics => {
            this.streamStatuses = metrics;
          });
      }
    } else {
      this.streamStatuses = [];
    }
  }

  /**
   * Toogle Expand
   */
  toggleExpand(streamName: string) {
    if (this.expanded[streamName]) {
      delete this.expanded[streamName];
    } else {
      this.expanded[streamName] = true;
    }
    this.updateMetrics();
  }

  get handler() {
    return false;
  }

  set handler(value) {
    console.log('HANDLE ' + value);
  }

  /**
   * Metrics for stream
   * @param {string} name
   * @returns {StreamStatus}
   */
  metricsForStream(name: string): StreamStatus {
    if (Array.isArray(this.streamStatuses)) {
      return this.streamStatuses.find(m => m.name === name);
    }
  }

}
