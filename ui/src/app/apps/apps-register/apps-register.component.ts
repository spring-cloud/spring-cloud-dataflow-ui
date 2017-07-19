import { Component, OnInit, OnChanges, ViewChild, ElementRef } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AppsService } from '../apps.service';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AppRegistration } from '../model/app-registration';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { ApplicationType } from '../model/application-type';

import { ChangeDetectorRef } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

@Component({
  selector: 'app-apps',
  templateUrl: './apps-register.component.html'
})
export class AppsRegisterComponent implements OnInit, OnChanges {

  @ViewChild('childPopover')
  public childPopover:PopoverDirective;

  // App name validation RegEx pattern
  public static namePattern = '[\\w_]+[\\w_-]*';

  public applicationTypes:String[] = ApplicationType.getApplicationTypes();
  // Basic URI validation RegEx pattern
  public static uriPattern = '^([a-z0-9-]+:\/\/)([\\w\\.:-]+)(\/[\\w\\.:-]+)*$';

  public model = [new AppRegistration()];

  busy: Subscription[] = [];

  contents: any;
  uriPattern = '^([a-z0-9-]+:\/\/)([\\w\\.:-]+)(\/[\\w\\.:-]+)*$';

  constructor(
    private ref: ChangeDetectorRef,
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
  };

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
    this.busy.push(this.appsService.registerMultipleApps(this.model).subscribe(
      data => {
        this.toastyService.success(`${data.length} App(s) registered.`);
        let reloadAppsObservable = this.appsService.getApps(true).subscribe(
          data => {
            console.log('Back to apps page ...')
            this.router.navigate(['apps'])
          }
        );
        this.busy.push(reloadAppsObservable);
      }
    ));
  };

  /**
   * Removes app comntroller entry
   * @param index Index of the entry
   */
  removeApp(index) {
    this.model.splice(index, 1);
  };

  /**
   * Adds app entry at the specified index
   * @param index Insertion index
   */
  addApp(index) {
    this.model.splice(index + 1, 0, new AppRegistration());
  };

  trackModel(index, appRegistration) {
    return index;
  }
}
