import { Directive, HostBinding, HostListener, Input, OnInit } from '@angular/core';
import { Stream } from '../model/stream.model';
import { Task } from '../model/task.model';
import { RuntimeApp, RuntimeAppInstance } from '../model/runtime.model';
import get from 'lodash.get';
import { WavefrontService } from './wavefront.service';

@Directive({
  selector: '[wavefrontDashboardStreams]'
})
export class WavefrontStreamsDirective implements OnInit {
  @HostBinding('hidden') hidden: boolean;

  constructor(private wavefrontService: WavefrontService) {
  }

  ngOnInit(): void {
    this.wavefrontService.isAllowed()
      .then(allow => {
        this.hidden = !allow;
      });
  }

  @HostListener('click') onClick() {
    // TODO
    // this.grafanaService.getDashboardStreams()
    //   .subscribe((url: string) => {
    //     window.open(url);
    //   });
  }
}

@Directive({
  selector: '[wavefrontDashboardStream]'
})
export class WavefrontStreamDirective implements OnInit {
  @HostBinding('disabled') disabled: boolean;
  @HostBinding('hidden') hidden: boolean;
  @Input() stream: Stream;

  constructor(private wavefrontService: WavefrontService) {
  }

  ngOnInit(): void {
    this.disabled = this.stream.status !== 'DEPLOYED';
    this.wavefrontService.isAllowed()
      .then(allow => {
        this.hidden = !allow;
      });
  }

  @HostListener('click') onClick() {
    // TODO
    // this.grafanaService.getDashboardStream(this.stream)
    //   .subscribe((url: string) => {
    //     window.open(url);
    //   });
  }

}

@Directive({
  selector: '[wavefrontDashboardTasks]'
})
export class WavefrontTasksDirective implements OnInit {
  @HostBinding('hidden') hidden: boolean;

  constructor(private wavefrontService: WavefrontService) {
  }

  ngOnInit(): void {
    this.wavefrontService.isAllowed()
      .then(allow => {
        this.hidden = !allow;
      });
  }

  @HostListener('click') onClick() {
    // TODO
    // this.grafanaService.getDashboardTasks()
    //   .subscribe((url: string) => {
    //     window.open(url);
    //   });
  }
}


@Directive({
  selector: '[wavefrontDashboardTask]'
})
export class WavefrontTaskDirective implements OnInit {
  @HostBinding('hidden') hidden: boolean;
  @Input() task: Task;

  constructor(private wavefrontService: WavefrontService) {
  }

  ngOnInit(): void {
    this.wavefrontService.isAllowed()
      .then(allow => {
        this.hidden = !allow;
      });
  }

  @HostListener('click') onClick() {
    // TODO
    // this.grafanaService.getDashboardTask(this.task)
    //   .subscribe((url: string) => {
    //     window.open(url);
    //   });
  }
}


@Directive({
  selector: '[wavefrontDashboardRuntimeApp]'
})
export class WavefrontRuntimeAppDirective implements OnInit {
  @HostBinding('disabled') disabled: boolean;
  @HostBinding('hidden') hidden: boolean;
  @Input() runtimeApp: RuntimeApp;
  streamName: string;
  appName: string;

  constructor(private wavefrontService: WavefrontService) {
  }

  ngOnInit(): void {
    this.wavefrontService.isAllowed()
      .then(allow => {
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
    // TODO
    // this.grafanaService.getDashboardApplication(this.streamName, this.appName)
    //   .subscribe((url: string) => {
    //     window.open(url);
    //   });
  }
}


@Directive({
  selector: '[wavefrontDashboardRuntimeInstance]'
})
export class WavefrontRuntimeInstanceDirective implements OnInit {
  @HostBinding('disabled') disabled: boolean;
  @HostBinding('hidden') hidden: boolean;
  @Input() instance: RuntimeAppInstance;
  appName = '';
  streamName = '';
  guid = '';

  constructor(private wavefrontService: WavefrontService) {
  }

  ngOnInit(): void {
    this.wavefrontService.isAllowed()
      .then(allow => {
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
    // TODO
    // this.grafanaService.getDashboardApplicationInstance(this.streamName, this.appName, this.guid)
    //   .subscribe((url: string) => {
    //     window.open(url);
    //   });
  }
}
