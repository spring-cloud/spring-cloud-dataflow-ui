import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-streams',
  templateUrl: './streams.component.html',
})
export class StreamsComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
  }

}
