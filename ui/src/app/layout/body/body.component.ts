import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { AboutInfo } from '../../shared/model/about/about-info.model';
import { SharedAboutService } from '../../shared/services/shared-about.service';

/**
 * Body component
 *
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
})
export class BodyComponent implements OnInit {

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * Initialize
   */
  ngOnInit(): void {
  }

}
