import { Component, OnInit, OnChanges, ViewChild, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AppsService } from '../apps.service';
import { ToastyService } from 'ng2-toasty';
import { Router } from '@angular/router';

import { AppRegistration } from '../../shared/model/app-registration.model';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { ApplicationType } from '../../shared/model/application-type';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import { Subject } from 'rxjs/Subject';
import { BusyService } from '../../shared/services/busy.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-apps',
  templateUrl: './apps-register.component.html'
})
export class AppsRegisterComponent implements OnInit, OnChanges, OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();

  // App name validation RegEx pattern
  public static namePattern = '[\\w_]+[\\w_-]*';
  // Basic URI validation RegEx pattern
  public static uriPattern = '^([a-z0-9-]+:\/\/)([\\w\\.:-]+)(\/[\\w\\.:-]+)*$';

  @ViewChild('childPopover')
  public childPopover: PopoverDirective;

  public applicationType = ApplicationType;

  public model = [new AppRegistration()];

  contents: any;
  uriPattern = '^([a-z0-9-]+:\/\/)([\\w\\.:-]+)(\/[\\w\\.:-]+)*$';

  constructor(
    private appsService: AppsService,
    private busyService: BusyService,
    private toastyService: ToastyService,
    private router: Router) {
    }

  ngOnInit() {
    console.log('App Service Registrations', this.appsService.appRegistrations);
    console.log(this.appsService.appRegistrations);
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
    const busy = this.appsService.registerMultipleApps(this.model)
    .pipe(takeUntil(this.ngUnsubscribe$))
    .subscribe(
      data => {
        this.toastyService.success(`${data.length} App(s) registered.`);
        this.busyService.addSubscription(
        this.appsService.getApps(true)
        .pipe(takeUntil(this.ngUnsubscribe$))
        .subscribe(
          appRegistrations => {
            console.log('Back to apps page ...');
            this.router.navigate(['apps']);
          }
        ));
      },
      error => {
        this.toastyService.error(error);
      }
    );
    this.busyService.addSubscription(busy);
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
