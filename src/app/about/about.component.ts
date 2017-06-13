import { Component, OnInit } from '@angular/core';
import {AboutService} from './about-service.service'
import {Subscription} from 'rxjs';
import { BusyModule, BusyDirective } from 'angular2-busy';
import {ToastyService, ToastyConfig, ToastOptions, ToastData} from 'ng2-toasty';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.scss'],
  providers: [AboutService]
})
export class AboutComponent implements OnInit {

  dataflowVersionInfo;
  busy: Subscription;

  constructor(private aboutService: AboutService, private toastyService:ToastyService) { }

  ngOnInit() {
    console.log('init');
    this.getVersionInfo();
  }

  getVersionInfo(): void {
    this.busy = this.aboutService.getAboutInfo().subscribe(
      data => {
        console.log('>>>>>>>>>>>', data);
        this.dataflowVersionInfo = data;
        this.toastyService.success("About data loaded.");
      }
    );
  }
}
