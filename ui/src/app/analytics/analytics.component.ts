import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

/**
 * Component of the Analytics module that handles
 * the Analytics tabs.
 *
 * @author Gunnar Hillert
 */
@Component({
  templateUrl: './analytics.component.html',
})
export class AnalyticsComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

}
