import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AppService } from '../../../shared/api/app.service';
import { NotificationService } from '../../../shared/service/notification.service';

@Component({
  selector: 'app-add-website-starters',
  templateUrl: './website-starters.component.html',
})
export class WebsiteStartersComponent {

  isImporting = false;
  value: string;
  force = false;

  uris = {
    'stream.kafka.maven': 'https://dataflow.spring.io/kafka-maven-latest',
    'stream.kafka.docker': 'https://dataflow.spring.io/kafka-docker-latest',
    'stream.rabbitmq.maven': 'https://dataflow.spring.io/rabbitmq-maven-latest',
    'stream.rabbitmq.docker': 'https://dataflow.spring.io/rabbitmq-docker-latest',
    'task.maven': 'https://dataflow.spring.io/task-maven-latest',
    'task.docker': 'https://dataflow.spring.io/task-docker-latest',
  };

  constructor(private router: Router,
              private notificationService: NotificationService,
              private appService: AppService) {
  }

  submit() {
    if (!this.value || !this.uris[this.value]) {
      this.notificationService.error('No starter selected', 'Please, select a starter pack.');
      return;
    }
    this.isImporting = true;
    this.appService
      .importUri(this.uris[this.value], this.force)
      // .pipe(takeUntil(this.ngUnsubscribe$), finalize(() => this.blockerService.unlock()))
      .subscribe(data => {
        this.notificationService.success('Import starters', 'Application(s) Imported.');
        this.back();
      }, (error) => {
        this.notificationService.error('An error occurred', error);
        this.isImporting = false;
      });
  }

  back() {
    this.router.navigateByUrl('apps');
  }

}
