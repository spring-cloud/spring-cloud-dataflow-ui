import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { TaskServiceMock } from '../../../tests/api/task.service.mock';
import { GrafanaServiceMock } from '../../../tests/service/grafana.service.mock';
import { GroupServiceMock } from '../../../tests/service/group.service.mock';
import { ContextServiceMock } from '../../../tests/service/context.service.mock';
import { SettingsServiceMock } from '../../../tests/service/settings.service.mock';
import { LaunchComponent } from './launch.component';
import { TaskLaunchService } from './task-launch.service';
import { LoggerService } from '../../../shared/service/logger.service';
import { AppServiceMock } from '../../../tests/api/app.service.mock';
import { ParserService } from '../../../flo/shared/service/parser.service';
import { Task } from '../../../shared/model/task.model';


@Component({
  selector: 'app-launch-builder',
  template: `
    <div>
    </div>`
})
class BuilderMockComponent {
  @Input() task: Task;
  @Input() properties: Array<string> = [];
  @Input() arguments: Array<string> = [];
  @Output() updateProperties = new EventEmitter();
  @Output() updateArguments = new EventEmitter();
  @Output() exportProperties = new EventEmitter();
  @Output() launch = new EventEmitter<{props: string[], args: string[]}>();
  @Output() copyProperties = new EventEmitter();

  constructor() {
  }
}

@Component({
  selector: 'app-task-launch-free-text',
  template: `
    <div>
    </div>`
})
class FreeTextMockComponent {
  @Input() task: Task;
  @Input() properties: Array<string> = [];
  @Input() arguments: Array<string> = [];
  @Output() updateProperties = new EventEmitter();
  @Output() updateArguments = new EventEmitter();
  @Output() exportProperties = new EventEmitter();
  @Output() copyProperties = new EventEmitter();
  @Output() exportArguments = new EventEmitter();
  @Output() copyArguments = new EventEmitter();
  @Output() launch = new EventEmitter<{props: string[], args: string[]}>();

  constructor() {
  }
}

describe('streams/streams/deploy/deploy.component.ts', () => {

  let component: LaunchComponent;
  let fixture: ComponentFixture<LaunchComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        LaunchComponent,
        BuilderMockComponent,
        FreeTextMockComponent
      ],
      imports: [
        FormsModule,
        ClarityModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule
      ],
      providers: [
        SecurityServiceMock.provider,
        AboutServiceMock.provider,
        NotificationServiceMock.provider,
        AppServiceMock.provider,
        TaskServiceMock.provider,
        GrafanaServiceMock.provider,
        GroupServiceMock.provider,
        ContextServiceMock.provider,
        SettingsServiceMock.provider,
        {
          provide: ActivatedRoute,
          useValue: {
            params: of({ name: 'foo' }),
          },
        },
        TaskLaunchService,
        LoggerService,
        ParserService
      ]
    })
      .compileComponents();
  }));


  beforeEach(() => {
    fixture = TestBed.createComponent(LaunchComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', async (done) => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    done();
  });

  it('should run a launch (success)', async (done) => {
    const spy = spyOn(TaskServiceMock.mock, 'launch').and.callThrough();
    const navigate = spyOn((<any>component).router, 'navigate');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    fixture.detectChanges();
    await fixture.whenStable();
    component.runLaunch([], []);
    fixture.detectChanges();
    await fixture.whenStable();
    expect(spy).toHaveBeenCalled();
    expect(navigate).toHaveBeenCalledWith(['/tasks-jobs/tasks']);
    done();
  });

});
