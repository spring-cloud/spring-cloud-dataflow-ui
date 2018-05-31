import { Component } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { OnInit } from '@angular/core';
import { BusyService } from './shared/services/busy.service';
import { RoutingStateService } from './shared/services/routing-state.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {


  public busy: any = [];

  constructor(private renderer: Renderer2,
              private routingStateService: RoutingStateService,
              private busyService: BusyService) {
  }

  ngOnInit() {
    this.routingStateService.watchRouting();
    
    this.busyService.busyObjects$.forEach(busyObject => {
      if (busyObject) {
        while (busyObject.length > 0) {
          /*
           * Unfortunately, Angular2 Busy does not support
           * "Overlapping Subscriptions" and does not work
           * with mutable arrays. Ideally, good Spinner solution
           * would be able to accept a BehaviorSubject<boolean> as input,
           * so that we could manage the on/off state of the spinner on
           * our end.
           *
           * see: https://github.com/devyumao/angular2-busy/issues/77
           */
          this.busy = [];
          this.busy.push(busyObject.pop());
        }
      }
    });
  }

}
