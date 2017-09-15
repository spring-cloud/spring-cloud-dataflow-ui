import {Component, OnInit, OnDestroy, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {StreamsService} from '../streams.service';
import {ToastyService} from 'ng2-toasty';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-stream-details',
  templateUrl: 'stream-details.component.html',
  styleUrls: [ 'stream-details.component.scss' ],
  encapsulation: ViewEncapsulation.None
})

export class StreamDetailsComponent implements OnInit, OnDestroy {

  id: string;
  dsl = '';
  private sub: any;
  busy: Subscription;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private streamsService: StreamsService,
              private toastyService: ToastyService) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
      this.id = params['id'];
      this.busy = this.streamsService.getRelatedDefinitions(this.id, true).subscribe(streams => {
        this.dsl = streams.map(s => `${s.name}=${s.dslText}`).join('\n');
      }, error => {
        this.toastyService.error(error);
      });
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
    this.busy.unsubscribe();
  }

  goBack() {
    this.router.navigate(['streams/definitions']);
  }

}
