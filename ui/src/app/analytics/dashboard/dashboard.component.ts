import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

/**
 * Main entry point to the Analytics Module. Provides
 * the ability to register various counters.
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
