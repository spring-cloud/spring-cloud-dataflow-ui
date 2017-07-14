import { Component, OnInit } from '@angular/core';
import { AboutService } from './about.service';
import { Subscription } from 'rxjs/Subscription';
import { BusyModule, BusyDirective } from 'angular2-busy';
import { ToastyService, ToastyConfig, ToastOptions, ToastData } from 'ng2-toasty';
import { Router, ActivatedRoute, Params } from '@angular/router';

@Component({
  templateUrl: './about.component.html',
  providers: [AboutService]
})
export class AboutComponent implements OnInit {

  dataflowVersionInfo;
  busy: Subscription;

  private subscription: any;

  constructor(private aboutService: AboutService, private toastyService: ToastyService,
              private router: Router) {

  }
  ngOnInit() {
    console.log('init');
    this.getVersionInfo();
  }

  getVersionInfo(): void {
    this.busy = this.aboutService.getAboutInfo().subscribe(
      data => {
        this.dataflowVersionInfo = data;
        this.toastyService.success('About data loaded.');
      }
    );
  }

  goToDetails() {
    console.log('Go to details ...');
    this.router.navigate(['about/details']);
  };
}
