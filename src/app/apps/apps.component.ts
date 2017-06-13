import { Component, OnInit } from '@angular/core';
import {Subscription} from 'rxjs';
import { AppsService } from './apps-service.service';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

@Component({
  selector: 'app-apps',
  templateUrl: './apps.component.html',
  styleUrls: ['./apps.component.scss'],
  providers: [AppsService]
})
export class AppsComponent implements OnInit {

  apps : any;
  busy: Subscription;
  constructor(private appsService:AppsService, private toastyService:ToastyService) { }

  ngOnInit() {
    this.busy = this.appsService.getApps().subscribe(
      data => {
        console.log('>>>>>>>>>>>', data);
        this.apps = data;
        this.toastyService.success("Apps loaded.");
      }
    );
  }

}
