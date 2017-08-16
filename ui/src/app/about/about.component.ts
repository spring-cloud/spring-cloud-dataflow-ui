import { Component, OnInit } from '@angular/core';
import { AboutService } from './about.service';
import { Subscription } from 'rxjs/Subscription';
import { ToastyService} from 'ng2-toasty';
import { Router } from '@angular/router';

@Component({
  templateUrl: './about.component.html',
})
export class AboutComponent implements OnInit {

  dataflowVersionInfo;
  busy: Subscription;

  private subscription: any;

  constructor(private aboutService: AboutService, private toastyService: ToastyService,
    private router: Router) {
  }

  ngOnInit() {
    this.getVersionInfo();
  }

  getVersionInfo(): void {
    this.busy = this.aboutService.getAboutInfo().subscribe(
      data => {
        this.dataflowVersionInfo = data;
        this.toastyService.success('About data loaded.');
      },
      error => {
        this.toastyService.error(error);
      }
    );
  }

  goToDetails() {
    this.router.navigate(['about/details']);
  }
}
