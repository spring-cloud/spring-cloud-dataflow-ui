import { Component, OnInit, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { AppsService } from './apps.service';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { Router, ActivatedRoute, Params } from '@angular/router';

import { AppRegistration } from './model/app-registration';
import { Page } from '../shared/model/page';

import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html'
})
export class AppsComponent implements OnInit {

  appRegistrations: Page<AppRegistration>;
  busy: Subscription;
  
  appRegistrationToUnregister: AppRegistration;

  @ViewChild('childModal')
  public childModal:ModalDirective;

  constructor(
    public appsService: AppsService,
    private toastyService: ToastyService,
    private router: Router ) {

    }

  ngOnInit() {
    this.busy = this.appsService.getApps().subscribe(
      data => {
        console.log('DATA', data);
        this.appRegistrations = data;
        console.log('DATA', this.appRegistrations);
        this.toastyService.success('Apps loaded.');
      }
    );
  }

  registerApps() {
    
  }

  unregister(item:AppRegistration, index:number) {
    console.log(index, item);
    this.appRegistrationToUnregister = item;
    this.showChildModal();
  }

  bulkImportApps() {
    console.log('Go to Bulk Import page ...');
    this.router.navigate(['apps/bulk-import-apps']);
  };

  public showChildModal():void {
    this.childModal.show();
  }
 
  public hideChildModal():void {
    this.childModal.hide();
  }

  public proceed = function() {
    this.hideChildModal();
  };

  public cancel = function() {
    this.hideChildModal();
  };
}
