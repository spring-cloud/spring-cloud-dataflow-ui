import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

/**
 * @author Gunnar Hillert
 */
@Component({
  selector: 'app-analytics',
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

}
