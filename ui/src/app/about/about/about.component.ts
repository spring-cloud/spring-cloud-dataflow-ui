import { Component, OnInit } from '@angular/core';
import { AboutService } from '../about.service';
import { Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { AboutInfo } from '../../shared/model/about/about-info.model';

/**
 * Component About Page.
 *
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./styles.scss']
})
export class AboutComponent implements OnInit {

  /**
   * Observable About Info
   */
  public dataflowVersionInfo$: Observable<AboutInfo>;

  /**
   * Show Details
   */
  public showDetails = false;

  /**
   * Constructor
   *
   * @param {AboutService} aboutService
   * @param {Router} router
   */
  constructor(private aboutService: AboutService,
              private router: Router) {
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.dataflowVersionInfo$ = this.aboutService.getAboutInfo();
  }

  /**
   * Toggle Details
   */
  toggleDetails() {
    this.showDetails = !this.showDetails;
  }

}
