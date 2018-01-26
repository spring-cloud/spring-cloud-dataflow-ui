import { Component, OnInit } from '@angular/core';
import { AboutService } from './about.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AboutInfo } from '../shared/model/about/about-info.model';

@Component({
  templateUrl: './about.component.html',
})
export class AboutComponent implements OnInit {

  public dataflowVersionInfo$: Observable<AboutInfo>;

  constructor(private aboutService: AboutService,
    private router: Router) {
  }

  ngOnInit() {
    this.dataflowVersionInfo$ = this.aboutService.getAboutInfo();
  }

  goToDetails() {
    this.router.navigate(['about/details']);
  }
}
