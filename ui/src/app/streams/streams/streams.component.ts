import { Subscription, timer } from 'rxjs';
import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Router } from '@angular/router';
import { StreamService } from '../../shared/api/stream.service';
import { Stream, StreamPage } from '../../shared/model/stream.model';
import { DestroyComponent } from './destroy/destroy.component';
import { UndeployComponent } from './undeploy/undeploy.component';
import { StreamStatus } from '../../shared/model/metrics.model';
import { GroupService } from '../../shared/service/group.service';
import { StatusComponent } from './status/status.component';
import { DatagridComponent } from '../../shared/component/datagrid/datagrid.component';
import { ContextService } from '../../shared/service/context.service';
import { SettingsService } from '../../settings/settings.service';

@Component({
  selector: 'app-streams-list',
  templateUrl: './streams.component.html',
})
export class StreamsComponent extends DatagridComponent implements OnDestroy, OnInit {
  page: StreamPage;
  expanded: {};
  @ViewChild('destroyModal', { static: true }) destroyModal: DestroyComponent;
  @ViewChild('undeployModal', { static: true }) undeployModal: UndeployComponent;
  @ViewChild('statusModal', { static: true }) statusModal: StatusComponent;
  metricsSubscription: Subscription;
  streamStatuses: StreamStatus[] = [];
  timeSubscription: Subscription;

  constructor(private streamService: StreamService,
              protected contextService: ContextService,
              protected settingsService: SettingsService,
              protected changeDetectorRef: ChangeDetectorRef,
              private groupService: GroupService,
              private router: Router) {
    super(contextService, settingsService, changeDetectorRef, 'streams/list');
  }

  ngOnInit(): void {
    this.expanded = { ...this.context['expanded'] || {} };
  }

  ngOnDestroy(): void {
    if (this.metricsSubscription) {
      this.metricsSubscription.unsubscribe();
    }
    if (this.timeSubscription) {
      this.timeSubscription.unsubscribe();
    }
    super.ngOnDestroy();
  }

  refresh(state: ClrDatagridStateInterface) {
    if (this.isReady()) {
      super.refresh(state);
      const expanded = { ...this.context.expanded };
      const params = this.getParams(state, { name: '' });
      this.unsubscribe$ = this.streamService.getStreams(params.current - 1, params.size, params.name || '', `${params.by || ''}`,
        `${params.reverse ? 'DESC' : 'ASC'}`)
        .subscribe((page: StreamPage) => {
          const mergeExpanded = {};
          page.items.forEach((item) => {
            if (expanded[item.name]) {
              mergeExpanded[item.name] = true;
            }
          });
          this.expanded = { ...mergeExpanded };
          this.page = page;
          this.updateGroupContext({ ...params, expanded: this.expanded });
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
      const group = this.groupService.create(streams.map(stream => stream.name));
      this.router.navigateByUrl(`streams/list/${group}/multi-deploy`);
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

  updateMetrics() {
    const expandedStreams = this.page.items.filter(s => this.expanded[s.name]);
    if (expandedStreams.length > 0) {
      const deployedStreamNames = expandedStreams
        .filter(s => {
          const status = s.status.toLowerCase();
          return (status === 'deployed') || (status === 'deploying') || (status === 'partial');
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

  toggleExpand(stream: string, active: boolean) {
    const exp = { ...this.expanded };
    exp[stream] = active;
    this.expanded = exp;
    this.updateContext('expanded', exp);
  }

  metricsForStream(name: string): StreamStatus {
    if (Array.isArray(this.streamStatuses)) {
      return this.streamStatuses.find(m => m.name === name);
    }
  }

}
