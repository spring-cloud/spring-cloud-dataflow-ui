import { Component } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { OnInit } from '@angular/core';
import { RoutingStateService } from './shared/services/routing-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {

  constructor(private renderer: Renderer2,
              private routingStateService: RoutingStateService) {
  }

  ngOnInit() {
    this.routingStateService.watchRouting();
  }

}
