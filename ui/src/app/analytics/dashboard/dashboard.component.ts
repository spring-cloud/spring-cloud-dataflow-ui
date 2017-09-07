import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

/**
 * The dashboard component provides
 * the ability to register various types of counters.
 *
 * @author Gunnar Hillert
 */
@Component({
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  busy: Subscription;

  ngOnInit() {
  }
}
