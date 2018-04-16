import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AboutInfo } from '../../shared/model/about/about-info.model';
import { SharedAboutService } from '../../shared/services/shared-about.service';

/**
 * Footer component
 *
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
})
export class FooterComponent implements OnInit {

  /**
   * Observable Version Info
   */
  public dataflowVersionInfo$: Observable<AboutInfo>;

  /**
   * Constructor
   *
   * @param {SharedAboutService} sharedAboutService
   */
  constructor(private sharedAboutService: SharedAboutService) {
  }

  /**
   * Initialize
   */
  ngOnInit(): void {
    this.dataflowVersionInfo$ = this.sharedAboutService.getAboutInfo();
  }

}
