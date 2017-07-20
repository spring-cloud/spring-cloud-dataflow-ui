import { Component, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AppsService } from '../apps.service';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { DetailedAppRegistration } from '../model/detailed-app-registration';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { ApplicationType } from '../model/application-type';

import { Observable } from 'rxjs/Observable';
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

  @ViewChild('childPopover')
  public childPopover:PopoverDirective;

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
       let appName: string = params['appName'];
       let appType: ApplicationType = params['appType'] as ApplicationType;
       
       console.log(`Retrieving app registration details for ${appName} (${appType}).`);
       this.busy.push(this.appsService.getAppInfo(appType, appName).subscribe(data => {
         this.detailedAppRegistration = data;
       }));
    });
  }

  goBack() {
    console.log('Back to apps page ...');
    this.router.navigate(['apps']);
  };

  closePopOver() {
    this.childPopover.hide();
  }
}
