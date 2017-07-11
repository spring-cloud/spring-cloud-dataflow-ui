import { Component, OnInit } from '@angular/core';
import { StreamDefinition } from '../model/stream-definition';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-stream-details',
  templateUrl: './stream-details.component.html',
})

export class StreamDetailsComponent implements OnInit {

  id: String;
  private sub: any;

  constructor(
    private route: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
       this.id = params['id']; // (+) converts string 'id' to a number

       // In a real app: dispatch action to load the details here.
    });
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}
