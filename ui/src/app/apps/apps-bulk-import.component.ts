import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs/Subscription';
import { AppsService } from './apps.service';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

@Component({
  selector: 'app-apps',
  templateUrl: './apps-bulk-import.component.html',
  providers: [AppsService]
})
export class AppsBulkImportComponent implements OnInit {

  apps: any;
  busy: Subscription;
  displayFileContents: any;
  contents: any;

  constructor( private appsService: AppsService, private toastyService: ToastyService ) { }

  ngOnInit() {
  }

}
