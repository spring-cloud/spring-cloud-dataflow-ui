import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RoutingStateService } from '../../shared/services/routing-state.service';

/**
 * Component that shows the details of a Stream Definition
 *
 * @author Janne Valkealahti
 * @author Gunnar Hillert
 * @author Glenn Renfro
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-stream',
  templateUrl: 'stream.component.html',
  styleUrls: ['styles.scss'],
  encapsulation: ViewEncapsulation.None
})

export class StreamComponent implements OnInit {

  /**
   * Stream ID
   */
  id: string;

  /**
   * Constructor
   * @param {ActivatedRoute} route
   * @param {RoutingStateService} routingStateService
   */
  constructor(private route: ActivatedRoute,
              private routingStateService: RoutingStateService) {
  }

  /**
   * Initialiaze component
   */
  ngOnInit() {
    this.route.params.subscribe(params => {
      this.id = params.id;
      // TODO: check if stream exist
    });
  }

  /**
   * Back action
   * Navigate to the previous URL or /streams/definitions
   */
  cancel() {
    this.routingStateService.back('/streams/definitions', /^(\/streams\/definitions\/)/);
  }

}
