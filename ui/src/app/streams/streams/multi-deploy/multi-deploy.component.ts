import { Component, EventEmitter, Output } from '@angular/core';
import { Stream } from '../../../shared/model/stream.model';

@Component({
  selector: 'app-stream-multi-deploy',
  templateUrl: './multi-deploy.component.html'
})
export class MultiDeployComponent {

  @Output() onDeployed = new EventEmitter();
  isOpen = false;
  isRunning = false;
  streams: Stream[];

  constructor() {
  }

  open(streams: Stream[]) {
    this.streams = streams;
    this.isOpen = true;
  }

  deploy() {
    // TODO
  }

}
