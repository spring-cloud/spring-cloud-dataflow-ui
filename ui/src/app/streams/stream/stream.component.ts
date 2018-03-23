import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

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

  id: string;

  /**
   * Constructor
   * @param {ActivatedRoute} route
   */
  constructor(private route: ActivatedRoute) {
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

}
