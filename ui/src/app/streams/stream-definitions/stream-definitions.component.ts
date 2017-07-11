import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";

@Component({
  selector: 'app-stream-definitions',
  templateUrl: './stream-definitions.component.html',
})
export class StreamDefinitionsComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  onLoadDeploy() {
    this.router.navigate(['/streams/ticktock/deploy']);
  }

}
