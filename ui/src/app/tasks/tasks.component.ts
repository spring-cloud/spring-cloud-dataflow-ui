import { Component, OnInit } from '@angular/core';
import { Router } from "@angular/router";

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {

  constructor(public router: Router) { }

  ngOnInit() {
    console.log('Taaaassssks');
  }

}
