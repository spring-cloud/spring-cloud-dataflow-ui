import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {AppService} from '../../shared/api/app.service';
import {App} from '../../shared/model/app.model';
import {DetailedApp} from '../../shared/model/detailed-app.model';
import {UnregisterComponent} from '../unregister/unregister.component';
import {NotificationService} from '../../shared/service/notification.service';
import {VersionComponent} from '../version/version.component';
import {HttpError} from '../../shared/model/error.model';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-app',
  templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {
  loading = true;
  loadingProperties = true;
  app: App;
  versions: App[];
  defaultApp: App;
  selectedApp: App;
  detailedApp: DetailedApp;
  @ViewChild('unregisterModal', {static: true})
  unregisterModal: UnregisterComponent;
  @ViewChild('versionModal', {static: true}) versionModal: VersionComponent;
  showAllProperties = true;
  tooManyProperties = false;

  constructor(
    private route: ActivatedRoute,
    private appsService: AppService,
    private router: Router,
    private notificationService: NotificationService,
    private translate: TranslateService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params: Params) => {
      this.app = App.parse({name: params.appName, type: params.appType});
      this.getVersions();
    });
  }

  getVersions(): void {
    this.loading = true;
    this.appsService.getAppVersions(this.app.name, this.app.type).subscribe(
      (apps: App[]) => {
        if (apps.length === 0) {
          this.notificationService.error(
            this.translate.instant('commons.message.error'),
            this.translate.instant('applications.details.notFound')
          );
          this.back();
        }
        this.versions = apps;
        this.defaultApp = this.versions.find(a => a.defaultVersion);
        if (this.defaultApp) {
          this.app = this.defaultApp;
        }
        this.changeVersion(this.defaultApp ? this.defaultApp : this.versions[0]);
        this.loading = false;
      },
      error => {
        this.notificationService.error(this.translate.instant('commons.message.error'), error);
        this.back();
      }
    );
  }

  getProperties(app: App): void {
    this.loadingProperties = true;
    this.selectedApp = app;
    if (this.detailedApp) {
      this.detailedApp.version = app.version;
      this.detailedApp.defaultVersion = app.defaultVersion;
    }
    console.log('Before app service get app :', app);
    this.appsService.getApp(app.name, app.type, app.version, '2').subscribe(
      (detailedApp: DetailedApp) => {
        this.tooManyProperties = detailedApp.options.length > 50;
        this.showAllProperties = !this.tooManyProperties;
        this.detailedApp = detailedApp;
        this.loadingProperties = false;
      },
      error => {
        this.notificationService.error('An error occurred', error);
        if (HttpError.is404(error)) {
          this.back();
        }
        this.detailedApp = DetailedApp.parse({
          name: app.name,
          version: app.version,
          versions: app.versions,
          type: app.type,
          defaultVersion: app.defaultVersion
        });
        this.loadingProperties = false;
      }
    );
  }

  changeVersion(app: App): void {
    if (this.selectedApp?.version === app?.version) {
      return;
    }
    this.getProperties(app);
  }

  back(): void {
    this.router.navigateByUrl('/apps');
  }

  unregister(): void {
    this.unregisterModal.open([this.app]);
  }

  manageVersions(): void {
    this.versionModal.open(this.detailedApp.name, this.detailedApp.type);
  }

  getReadableId(id: string): string {
    const max = 60;
    if (id.length > max) {
      return `... ${id.substring(id.length - max, id.length)}`;
    }
    return id;
  }
}
