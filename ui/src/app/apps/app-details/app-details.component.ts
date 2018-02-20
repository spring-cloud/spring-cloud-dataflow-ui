import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router, ActivatedRoute, Params} from '@angular/router';
import {AppsService} from '../apps.service';
import {ToastyService} from 'ng2-toasty';
import {ApplicationType, DetailedAppRegistration} from '../../shared/model';
import {Subscription} from 'rxjs/Subscription';
import {SharedAboutService} from '../../shared/services/shared-about.service';
import {AppRegistration} from '../../shared/model/app-registration.model';
import {FeatureInfo} from '../../shared/model/about/feature-info.model';
import {AppVersionsComponent} from '../app-versions/app-versions.component';
import {BsModalService} from 'ngx-bootstrap';
import {SortParams} from '../../shared/components/shared.interface';
import {combineLatest} from 'rxjs/operators/combineLatest';
import {Subject} from 'rxjs/Subject';
import {takeUntil} from 'rxjs/operators';
import {BusyService} from '../../shared/services/busy.service';

/**
 * Provides details for an App Registration
 *
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-details',
  styleUrls: ['./styles.scss'],
  templateUrl: './app-details.component.html'
})
export class AppDetailsComponent implements OnInit, OnDestroy {

  /**
   * Busy Subscriptions
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Properties
   */
  detailedAppRegistration: DetailedAppRegistration;

  /**
   * Skipper State
   */
  skipperEnabled: boolean;

  /**
   * Application
   */
  application: AppRegistration;

  /**
   * Current default version
   */
  defaultVersion: any;

  /**
   * State selected version (dropdown)
   */
  versionSelect: string;

  /**
   * Sort parameters use on the versions list
   * @type {SortParams} Sort/Order params
   */
  sort: SortParams = {
    sort: '',
    order: ''
  };

  /**
   * Constructor
   *
   * @param {AppsService} appsService
   * @param {SharedAboutService} sharedAboutService
   * @param {ToastyService} toastyService
   * @param {ActivatedRoute} route
   * @param {Router} router
   * @param {BusyService} busyService
   * @param {BsModalService} modalService
   */
  constructor(private appsService: AppsService,
              private sharedAboutService: SharedAboutService,
              private toastyService: ToastyService,
              private router: Router,
              private route: ActivatedRoute,
              private busyService: BusyService,
              private modalService: BsModalService) {

  }

  /**
   * Init
   */
  ngOnInit() {
    console.log('App Service Details');
    this.sharedAboutService.getFeatureInfo().pipe(combineLatest(this.route.params)).subscribe((data: any[]) => {
      const featureInfo = data[0] as FeatureInfo;
      const params = data[1] as Params;
      this.application = new AppRegistration(params['appName'], params['appType'] as ApplicationType);
      this.skipperEnabled = featureInfo.skipperEnabled;
      this.refresh();
    });
  }

  /**
   * Will cleanup any {@link Subscription}s to prevent
   * memory leaks.
   */
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Refresh page, load the current version informations
   */
  refresh() {
    if (!this.skipperEnabled) {
      this.loadProperties();
    } else {
      this.loadVersions();
    }
  }

  /**
   * Used to load properties
   *
   * @param {string} version Optional version
   */
  loadProperties(version: string = '') {
    console.log('Retrieving properties application for ' + this.application.name + ' (' +
    this.application.type + ', version ' + version ? version : '/' + ').');

    this.versionSelect = version;
    const busy = this.appsService.getAppInfo(this.application.type, this.application.name, version)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((detailed: DetailedAppRegistration) => {
          this.detailedAppRegistration = detailed;
        },
        error => {
          this.toastyService.error(error);
        });

    this.busyService.addSubscription(busy);
  }

  /**
   * Used to load versions of an application
   */
  loadVersions() {
    console.log(`Retrieving versions application for ${this.application.name} (${this.application.type}).`);
    const busy = this.appsService
      .getAppVersions(ApplicationType[this.application.type.toString()], this.application.name)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((data: any) => {
          this.application.versions = data;
          this.defaultVersion = this.application.versions.find((a) => a.defaultVersion);
          if (this.defaultVersion) {
            this.application.version = this.defaultVersion.version;
            this.application.uri = this.defaultVersion.uri;
            this.selectVersion(this.defaultVersion.version);
          } else {
            this.selectVersion(this.application.versions[0].version);
          }
        },
        error => {
          this.toastyService.error(error);
        });

    this.busyService.addSubscription(busy);
  }

  /**
   * Apply sort
   * Triggered on column header click
   *
   * @param {SortParams} sort
   */
  applySort(sort: SortParams) {
    this.sort.sort = sort.sort;
    this.sort.order = sort.order;
  }

  /**
   * Open the version dialog of an application
   *
   * @param {AppRegistration} appRegistration
   */
  versions(appRegistration: AppRegistration) {
    console.log(`Manage versions ${appRegistration.name} app.`, appRegistration);
    const modal = this.modalService.show(AppVersionsComponent, {class: 'modal-xl'});
    modal.content.open(appRegistration).subscribe(() => {
      this.loadVersions();
    });
  }


  /**
   * Used to load properties form a selected version
   *
   * @param {string} version of the application
   */
  selectVersion(version: string) {
    if (this.versionSelect === version) {
      return;
    }
    this.loadProperties(version);
  }

  /**
   * Back to the applications list
   */
  cancel() {
    this.router.navigate(['apps']);
  }
}
