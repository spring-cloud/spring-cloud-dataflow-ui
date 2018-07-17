import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { StreamDefinition } from '../../model/stream-definition';
import { map, mergeMap } from 'rxjs/internal/operators';
import { StreamsService } from '../../streams.service';
import { ActivatedRoute, Router } from '@angular/router';
import { StreamHistory } from '../../model/stream-history';

/**
 * Component that shows the history of a Stream Definition
 * Available only if skipper is enabled
 *
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-stream-history',
  templateUrl: 'stream-history.component.html',
  styleUrls: ['../styles.scss'],
})
export class StreamHistoryComponent implements OnInit {

  /**
   * Observable of stream information
   * Contains the stream definition, a list of the streams"s apps
   */
  stream$: Observable<any>;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private streamsService: StreamsService) {
  }

  ngOnInit() {
    this.stream$ = this.route.parent.params
      .pipe(mergeMap(
        val => this.streamsService.getDefinition(val.id)
      ))
      .pipe(mergeMap(
        (streamDefinition: StreamDefinition) => this.streamsService.getHistory(streamDefinition.name)
          .pipe(map((streamHistory: StreamHistory[]) => {
            return {
              stream: streamDefinition,
              history: streamHistory
            };
          }))
      ));
  }

}
