import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AppsService } from '../apps.service';
import { ToastyService } from 'ng2-toasty';

import { DetailedAppRegistration } from '../model/detailed-app-registration';
import { ApplicationType } from '../../shared/model/application-type';

import { Subscription } from 'rxjs/Subscription';
import 'rxjs/add/observable/of';

/**
 * Provides details for an App Registration
 *
 * @author Gunnar Hillert
 */
@Component({
  templateUrl: './app-details.component.html'
})
export class AppDetailsComponent implements OnInit {

  public detailedAppRegistration: DetailedAppRegistration;

  busy: Subscription[] = [];

  constructor(
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
       this.busy.push(this.appsService.getAppInfo(appType, appName).subscribe(data => {
          this.detailedAppRegistration = data;
        },
        error => {
          this.toastyService.error(error);
        })
      );
    });
  }

  goBack() {
    console.log('Back to apps page ...');
    this.router.navigate(['apps']);
  };


}
