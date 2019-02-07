import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { RoutingStateService } from './shared/services/routing-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  /**
   * Constructor
   * @param routingStateService
   */
  constructor(private routingStateService: RoutingStateService) {
  }

  ngOnInit() {
    this.routingStateService.watchRouting();
  }

}
