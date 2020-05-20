import { Component, OnInit } from '@angular/core';
import { RuntimeApp } from '../../../shared/model/runtime.model';

@Component({
  selector: 'app-runtime-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.scss']
})
export class DetailsComponent {

  runtimeApp: RuntimeApp;
  isOpen = false;

  constructor() {
  }

  open(runtimeApp: RuntimeApp) {
    this.runtimeApp = runtimeApp;
    this.isOpen = true;
  }

}
