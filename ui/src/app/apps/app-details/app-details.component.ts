import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AppsService } from '../apps.service';
import { ToastyService } from 'ng2-toasty';

import { ApplicationType, DetailedAppRegistration } from '../../shared/model';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';
import { Subject } from 'rxjs/Subject';
import { BusyService } from '../../shared/services/busy.service';
import { takeUntil } from 'rxjs/operators';

/**
 * Provides details for an App Registration
 *
 * @author Gunnar Hillert
 */
@Component({
  templateUrl: './app-details.component.html'
})
export class AppDetailsComponent implements OnInit, OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();

  public detailedAppRegistration: DetailedAppRegistration;

  constructor(
    private busyService: BusyService,
    private route: ActivatedRoute,
    private appsService: AppsService,
    private toastyService: ToastyService,
    private router: Router) {
  }

  ngOnInit() {
    console.log('App Service Registrations', this.appsService.appRegistrations);
    console.log(this.appsService.appRegistrations);

    this.route.params.subscribe(params => {
      const appName: string = params['appName'];
      const appType: ApplicationType = params['appType'] as ApplicationType;

      console.log(`Retrieving app registration details for ${appName} (${appType}).`);
      const busy = this.appsService.getAppInfo(appType, appName)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(data => {
        this.detailedAppRegistration = data;
      },
      error => {
        this.toastyService.error(error);
      });
      setTimeout(()=>{
        this.busyService.addSubscription(busy);
      });
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

  goBack() {
    console.log('Back to apps page ...');
    this.router.navigate(['apps']);
  }
}
