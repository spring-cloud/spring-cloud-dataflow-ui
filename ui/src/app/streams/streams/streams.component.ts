import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Router } from '@angular/router';
import { StreamService } from '../../shared/api/stream.service';
import { Stream, StreamPage } from '../../shared/model/stream.model';
import { DestroyComponent } from './destroy/destroy.component';
import { UndeployComponent } from './undeploy/undeploy.component';
import { DatagridComponent } from '../../shared/component/datagrid/datagrid.component';
import { ContextService } from '../../shared/service/context.service';

@Component({
  selector: 'app-streams-list',
  templateUrl: './streams.component.html',
})
export class StreamsComponent extends DatagridComponent implements OnDestroy, OnInit {
  page: StreamPage;
  expended: object;
  @ViewChild('destroyModal', { static: true }) destroyModal: DestroyComponent;
  @ViewChild('undeployModal', { static: true }) undeployModal: UndeployComponent;

  constructor(private streamService: StreamService,
              protected contextService: ContextService,
              private router: Router) {
    super(contextService, 'streams');
  }

  ngOnInit(): void {
    this.expended = this.contextService.get('streams.expended') || [];
    super.ngOnInit();
  }

  ngOnDestroy(): void {
    super.ngOnDestroy();
    this.updateContext('expended', this.expended);
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
            mergeExpended[item.name] = this.expended[item.name] || false;
          });
          this.expended = mergeExpended;
          this.page = page;
          this.updateGroupContext(params);
          this.selected = [];
          this.loading = false;
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
      // TODO
    }
    // this.router.navigateByUrl(`streams/list/${stream.name}`);
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

}
