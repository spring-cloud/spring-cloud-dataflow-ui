import { Component, ViewChild } from '@angular/core';
import { AppService } from '../../shared/api/app.service';
import { ClrDatagridStateInterface } from '@clr/angular';
import { App, AppPage } from '../../shared/model/app.model';
import { UnregisterComponent } from './unregister/unregister.component';
import { Router } from '@angular/router';
import { VersionComponent } from './version/version.component';
import { SettingsService } from '../../settings/settings.service';
import { DatagridComponent } from '../../shared/component/datagrid/datagrid.component';

@Component({
  selector: 'app-apps-list',
  templateUrl: './apps.component.html'
})
export class AppsComponent extends DatagridComponent {
  page: AppPage;
  @ViewChild('unregisterModal', { static: true }) unregisterModal: UnregisterComponent;
  @ViewChild('versionModal', { static: true }) versionModal: VersionComponent;

  constructor(private appService: AppService,
              private router: Router,
              protected settingsService: SettingsService) {
    super(settingsService, 'manage/apps');
  }

  refresh(state: ClrDatagridStateInterface) {
    if (this.isReady()) {
      super.refresh(state);
      const params = this.getParams(state, { name: '', type: '' });
      this.appService.getApps(params.current - 1, params.size, params.name, params.type,
        `${params.by || 'name'}`, `${params.reverse ? 'DESC' : 'ASC'}`, true)
        .subscribe((page: AppPage) => {
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

  manageVersion(app: App) {
    this.versionModal.open(app.name, app.type);
  }

}
