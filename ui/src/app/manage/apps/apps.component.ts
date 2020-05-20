import { Component, ViewChild } from '@angular/core';
import { AppService } from '../../shared/api/app.service';
import { ClrDatagridStateInterface } from '@clr/angular';
import { App, AppPage } from '../../shared/model/app.model';
import { UnregisterComponent } from './unregister/unregister.component';
import { Router } from '@angular/router';
import { ContextService } from '../../shared/service/context.service';
import { DatagridComponent } from '../../shared/component/datagrid/datagrid.component';

@Component({
  selector: 'app-apps-list',
  templateUrl: './apps.component.html'
})
export class AppsComponent extends DatagridComponent {
  page: AppPage;
  @ViewChild('unregisterModal', { static: true }) unregisterModal: UnregisterComponent;

  constructor(private appService: AppService,
              private router: Router,
              protected contextService: ContextService) {
    super(contextService, 'apps');
  }

  refresh(state: ClrDatagridStateInterface) {
    if (this.isReady()) {
      super.refresh(state);
      const params = this.getParams(state, { name: '', type: '' });
      this.appService.getApps(params.current - 1, params.size, params.name, params.type,
        `${params.by || 'name'}`, `${params.reverse ? 'DESC' : 'ASC'}`)
        .subscribe((page: AppPage) => {
          this.attachColumns();
          this.page = page;
          this.updateGroupContext(params);
          this.selected = [];
          this.loading = false;
        });
    }
  }

  details(app: App) {
    this.router.navigateByUrl(`manage/apps/${app.type}/${app.name}`);
  }

  add() {
    this.router.navigateByUrl(`manage/apps/add`);
  }

  unregistersApp(apps: App[]) {
    this.unregisterModal.open(apps);
  }

}
