import { Component, OnInit, OnChanges, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Subscription} from 'rxjs/Subscription';
import { AppsService } from './apps.service';
import { ToastyService } from 'ng2-toasty';
import { Router } from '@angular/router';

import { AppRegistrationImport } from './model/app-registration-import';
import { PopoverDirective } from 'ngx-bootstrap/popover';
import { Subject } from 'rxjs/Subject';
import { BusyService } from '../shared/services/busy.service';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-apps',
  templateUrl: './apps-bulk-import.component.html'
})
export class AppsBulkImportComponent implements OnInit, OnChanges, OnDestroy {

  private ngUnsubscribe$: Subject<any> = new Subject();

  @ViewChild('childPopover')
  public childPopover: PopoverDirective;

  public model = new AppRegistrationImport(false, [], '');

  apps: any;

  contents: any;
  uriPattern = '^([a-z0-9-]+:\/\/)([\\w\\.:-]+)(\/[\\w\\.:-]+)*$';

  constructor(
    private appsService: AppsService,
    private busyService: BusyService,
    private toastyService: ToastyService,
    private router: Router,
    private elementRef: ElementRef) { }

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

  displayFileContents(contents) {
    console.log(contents);
    const reader = new FileReader();
    reader.onloadend = (e) => {
      this.parseTextArea(reader.result);
    };
    console.log(contents.target.files[0]);
    reader.readAsText(contents.target.files[0]);
  }

  getAppsPropertiesAsString(): string {
    return this.model.appsProperties.join('\n');
  }

  parseTextArea(data) {
    if (data.trim().length > 0) {
      this.model.appsProperties = data.split('\n');
    } else {
      this.model.appsProperties = [];
    }
  }

  ngOnChanges(changes) {
      console.log(changes);
  }

  closePopOver() {
    this.childPopover.hide();
  }
  /**
   * Bulk Import Apps.
   */
  bulkImportApps() {

      if (this.model.uri && this.model.appsProperties.length > 0) {
          this.toastyService.error('Please provide only a URI or Properties not both.');
          return;
      }

      if (this.model.uri) {
          console.log('Importing apps from ' + this.model.uri + ' (force: ' + this.model.force + ')');
      }
      if (this.model.appsProperties.length > 0) {
          console.log('Importing apps using textarea values:\n' + this.model.appsProperties + ' (force: ' + this.model.force + ')');
      }

      const busy = this.appsService.bulkImportApps(this.model).subscribe(
        data => {
          console.log(data);
          this.toastyService.success('Apps Imported.');
          this.busyService.addSubscription(
          this.appsService.getApps(true)
          .pipe(takeUntil(this.ngUnsubscribe$))
          .subscribe(
            appRegistrations => {
              console.log('Back to about page ...');
              this.router.navigate(['apps']);
            }
          ));
        }
      );
      this.busyService.addSubscription(busy);
  }
}
