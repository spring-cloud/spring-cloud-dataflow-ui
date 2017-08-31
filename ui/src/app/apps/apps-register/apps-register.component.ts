import { Component, OnInit, OnChanges, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AppsService } from '../apps.service';
import { ToastyService } from 'ng2-toasty';
import { Router } from '@angular/router';

import { AppRegistration } from '../../shared/model/app-registration.model';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { ApplicationType } from '../../shared/model/application-type';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-apps',
  templateUrl: './apps-register.component.html'
})
export class AppsRegisterComponent implements OnInit, OnChanges {

  // App name validation RegEx pattern
  public static namePattern = '[\\w_]+[\\w_-]*';
  // Basic URI validation RegEx pattern
  public static uriPattern = '^([a-z0-9-]+:\/\/)([\\w\\.:-]+)(\/[\\w\\.:-]+)*$';

  @ViewChild('childPopover')
  public childPopover: PopoverDirective;

  public applicationType = ApplicationType;

  public model = [new AppRegistration()];

  busy: Subscription;

  contents: any;
  uriPattern = '^([a-z0-9-]+:\/\/)([\\w\\.:-]+)(\/[\\w\\.:-]+)*$';

  constructor(
    private appsService: AppsService,
    private toastyService: ToastyService,
    private router: Router) {
    }

  ngOnInit() {
    console.log('App Service Registrations', this.appsService.appRegistrations);
    console.log(this.appsService.appRegistrations);
  }

  goBack() {
    console.log('Back to apps page ...');
    this.router.navigate(['apps']);
  }

  ngOnChanges(changes) {
      console.log(changes);
  }

  closePopOver() {
    this.childPopover.hide();
  }

  public getItemsAsObservable(): Observable<AppRegistration[]> {
    return Observable.of(this.model);
  }
  /**
   * Register the app.
   */
  register() {
    console.log(`Register ${this.model.length} app(s).`);
    this.busy = this.appsService.registerMultipleApps(this.model).subscribe(
      data => {
        this.toastyService.success(`${data.length} App(s) registered.`);
        this.busy = this.appsService.getApps(true).subscribe(
          appRegistrations => {
            console.log('Back to apps page ...');
            this.router.navigate(['apps']);
          }
        );
      },
      error => {
        this.toastyService.error(error);
      }
    );
  }

  /**
   * Removes app comntroller entry
   * @param index Index of the entry
   */
  removeApp(index) {
    this.model.splice(index, 1);
  }

  /**
   * Adds app entry at the specified index
   * @param index Insertion index
   */
  addApp(index) {
    this.model.splice(index + 1, 0, new AppRegistration());
  }

  trackModel(index, appRegistration) {
    return index;
  }
}
