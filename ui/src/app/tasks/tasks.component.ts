import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-tasks',
  templateUrl: './tasks.component.html',
})
export class TasksComponent implements OnInit {

  constructor() { }

  ngOnInit() {
    console.log('Taaaassssks');
  }

}
