import { Directive, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { Stream } from '../model/stream.model';
import { GrafanaService } from './grafana.service';
import { Task } from '../model/task.model';
import { RuntimeApp, RuntimeAppInstance } from '../model/runtime.model';
import get from 'lodash.get';
import { TaskExecution } from '../model/task-execution.model';
import { JobExecution } from '../model/job.model';

@Directive({
  selector: '[grafanaDashboardStreams]'
})
export class GrafanaStreamsDirective implements OnInit {
  @HostBinding('hidden') hidden: boolean;

  constructor(private grafanaService: GrafanaService) {
  }

  ngOnInit(): void {
    this.grafanaService.isAllowed()
      .subscribe(allow => {
        this.hidden = !allow;
      });
  }

  @HostListener('click') onClick() {
    this.grafanaService.getDashboardStreams()
      .subscribe((url: string) => {
        window.open(url);
      });
  }
}

@Directive({
  selector: '[grafanaDashboardStream]'
})
export class GrafanaStreamDirective implements OnInit {
  @HostBinding('disabled') disabled: boolean;
  @HostBinding('hidden') hidden: boolean;
  @Input() stream: Stream;

  constructor(private grafanaService: GrafanaService) {
  }

  ngOnInit(): void {
    this.disabled = this.stream.status !== 'DEPLOYED';
    this.grafanaService.isAllowed()
      .subscribe(allow => {
        this.hidden = !allow;
      });
  }

  @HostListener('click') onClick() {
    this.grafanaService.getDashboardStream(this.stream)
      .subscribe((url: string) => {
        window.open(url);
      });
  }

}

@Directive({
  selector: '[grafanaDashboardTasks]'
})
export class GrafanaTasksDirective implements OnInit {
  @HostBinding('hidden') hidden: boolean;

  constructor(private grafanaService: GrafanaService) {
  }

  ngOnInit(): void {
    this.grafanaService.isAllowed()
      .subscribe(allow => {
        this.hidden = !allow;
      });
  }

  @HostListener('click') onClick() {
    this.grafanaService.getDashboardTasks()
      .subscribe((url: string) => {
        window.open(url);
      });
  }
}


@Directive({
  selector: '[grafanaDashboardTask]'
})
export class GrafanaTaskDirective implements OnInit {
  @HostBinding('hidden') hidden: boolean;
  @Input() task: Task;

  constructor(private grafanaService: GrafanaService) {
  }

  ngOnInit(): void {
    this.grafanaService.isAllowed()
      .subscribe(allow => {
        this.hidden = !allow;
      });
  }

  @HostListener('click') onClick() {
    this.grafanaService.getDashboardTask(this.task)
      .subscribe((url: string) => {
        window.open(url);
      });
  }
}


@Directive({
  selector: '[grafanaDashboardRuntimeApp]'
})
export class GrafanaRuntimeAppDirective implements OnInit {
  @HostBinding('disabled') disabled: boolean;
  @HostBinding('hidden') hidden: boolean;
  @Input() runtimeApp: RuntimeApp;
  streamName: string;
  appName: string;

  constructor(private grafanaService: GrafanaService) {
  }

  ngOnInit(): void {
    this.grafanaService.isAllowed()
      .subscribe(allow => {
        this.hidden = !allow;
      });
    if (this.runtimeApp.appInstances && this.runtimeApp.appInstances.length > 0) {
      const firstInstance: RuntimeAppInstance = this.runtimeApp.appInstances[0];
      if (firstInstance.attributes) {
        this.appName = get(firstInstance.attributes, 'skipper.application.name');
        this.streamName = get(firstInstance.attributes, 'skipper.release.name');
      }
    }
    if (!this.appName || !this.streamName) {
      this.disabled = true;
    }
  }

  @HostListener('click') onClick() {
    this.grafanaService.getDashboardApplication(this.streamName, this.appName)
      .subscribe((url: string) => {
        window.open(url);
      });
  }
}


@Directive({
  selector: '[grafanaDashboardRuntimeInstance]'
})
export class GrafanaRuntimeInstanceDirective implements OnInit {
  @HostBinding('disabled') disabled: boolean;
  @HostBinding('hidden') hidden: boolean;
  @Input() instance: RuntimeAppInstance;
  appName = '';
  streamName = '';
  guid = '';

  constructor(private grafanaService: GrafanaService) {
  }

  ngOnInit(): void {
    this.grafanaService.isAllowed()
      .subscribe(allow => {
        this.hidden = !allow;
      });
    if (this.instance.attributes) {
      this.appName = get(this.instance.attributes, 'skipper.application.name');
      this.streamName = get(this.instance.attributes, 'skipper.release.name');
      this.guid = get(this.instance.attributes, 'guid');
    }
    if (!this.streamName || !this.appName || !this.guid) {
      this.disabled = true;
    }
  }

  @HostListener('click') onClick() {
    this.grafanaService.getDashboardApplicationInstance(this.streamName, this.appName, this.guid)
      .subscribe((url: string) => {
        window.open(url);
      });
  }
}

@Directive({
  selector: '[grafanaDashboardTaskExecution]'
})
export class GrafanaTaskExecutionDirective implements OnInit {
  @HostBinding('disabled') disabled: boolean;
  @HostBinding('hidden') hidden: boolean;
  @Input() taskExecution: TaskExecution;

  constructor(private grafanaService: GrafanaService) {
  }

  ngOnInit(): void {
    this.grafanaService.isAllowed()
      .subscribe(allow => {
        this.hidden = !allow;
      });
  }

  @HostListener('click') onClick() {
    this.grafanaService.getDashboardTaskExecution(this.taskExecution)
      .subscribe((url: string) => {
        window.open(url);
      });
  }
}

@Directive({
  selector: '[grafanaDashboardJobExecution]'
})
export class GrafanaJobExecutionDirective implements OnInit {
  @HostBinding('disabled') disabled: boolean;
  @HostBinding('hidden') hidden: boolean;
  @Input() jobExecution: JobExecution;

  constructor(private grafanaService: GrafanaService) {
  }

  ngOnInit(): void {
    this.grafanaService.isAllowed()
      .subscribe(allow => {
        this.hidden = !allow;
      });
  }

  @HostListener('click') onClick() {
    this.grafanaService.getDashboardJobExecution(this.jobExecution)
      .subscribe((url: string) => {
        window.open(url);
      });
  }
}
