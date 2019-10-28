import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TasksService } from '../tasks.service';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { MockNotificationService } from '../../tests/mocks/notification';
import { DataflowDateTimePipe } from '../../shared/pipes/dataflow-date-time.pipe';
import { MockTasksService } from '../../tests/mocks/tasks';
import { TASK_DEFINITIONS } from '../../tests/mocks/mock-data';
import { TaskLaunchComponent } from './task-launch.component';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { NotificationService } from '../../shared/services/notification.service';
import { MockRoutingStateService } from '../../tests/mocks/routing-state';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { DATAFLOW_LIST } from 'src/app/shared/components/list/list.component';
import { PagerComponent } from 'src/app/shared/components/pager/pager.component';
import { DATAFLOW_PAGE } from '../../shared/components/page/page.component';
import { NgxPaginationModule } from 'ngx-pagination/dist/ngx-pagination';
import { BsDropdownModule, PopoverModule, TooltipModule } from 'ngx-bootstrap';
import { KvRichTextComponent } from '../../shared/components/kv-rich-text/kv-rich-text.component';
import { ClipboardModule, ClipboardService } from 'ngx-clipboard';
import { Platform } from '../../shared/model/platform';
import { TaskDefinition } from '../model/task-definition';
import { By } from '@angular/platform-browser';
import { TippyDirective } from '../../shared/directives/tippy.directive';
import { BlockerService } from '../../shared/components/blocker/blocker.service';

/**
 * Test {@link TaskLaunchComponent}.
 *
 * @author Damien Vitrac
 */
describe('TaskLaunchComponent', () => {
  let component: TaskLaunchComponent;
  let fixture: ComponentFixture<TaskLaunchComponent>;
  let activeRoute: MockActivatedRoute;
  const notificationService = new MockNotificationService();
  const tasksService = new MockTasksService();
  const routingStateService = new MockRoutingStateService();
  const commonTestParams = { id: 'foo' };

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      declarations: [
        TaskLaunchComponent,
        DataflowDateTimePipe,
        LoaderComponent,
        DATAFLOW_PAGE,
        DATAFLOW_LIST,
        KvRichTextComponent,
        PagerComponent,
        TippyDirective
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        NgxPaginationModule,
        ClipboardModule,
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: TasksService, useValue: tasksService },
        { provide: ActivatedRoute, useValue: activeRoute },
        { provide: RoutingStateService, useValue: routingStateService },
        { provide: NotificationService, useValue: notificationService },
        ClipboardService,
        BlockerService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    tasksService.taskDefinitions = TASK_DEFINITIONS;
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(TaskLaunchComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('Component should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Prepare Arguments', () => {

    beforeEach(() => {
      fixture.detectChanges();
    });

    it('Name, no arg, 2 properties', () => {
      const result = component.prepareParams('name', [], ['prop1=val1', 'prop2=val2'], 'default');
      expect(result.name).toBe('name');
      expect(result.args).toBe('');
      expect(result.props).toBe('prop1=val1, prop2=val2');
    });

    it('Name, 2 args, no property', () => {
      const result = component.prepareParams('name', ['arg1=val1', 'arg2=val2'], [], 'default');
      expect(result.name).toBe('name');
      expect(result.args).toBe('arg1=val1 arg2=val2');
      expect(result.props).toBe('');
    });

    it('Name, 2 args, 2 properties', () => {
      const result = component.prepareParams('name', ['arg1=valArg1', 'arg2=valArg2'], ['prop1=valProp1', 'prop2=valProp2'], 'sample');
      expect(result.name).toBe('name');
      expect(result.args).toBe('arg1=valArg1 arg2=valArg2');
      expect(result.props).toBe('prop1=valProp1, prop2=valProp2, spring.cloud.dataflow.task.platformName=sample');
    });

  });

  describe('Platform Integration', () => {

    beforeEach(() => {
      fixture.detectChanges();
    });

    it('Can select a platform', () => {
      const task = {
        task: new TaskDefinition('foo', 'timestamp', 'demo-description', false, 'COMPLETE'),
        platforms: [
          new Platform('foo', 'foo', 'foo'),
          new Platform('bar', 'bar', 'bar'),
        ]
      };
      expect(component.canSelectPlatform(task)).toBeTruthy();
    });

    it('Can not select a platform', () => {
      const task = {
        task: new TaskDefinition('foo', 'timestamp', 'demo-description', false, 'COMPLETE'),
        platforms: [
          new Platform('foo', 'foo', 'foo')
        ]
      };
      expect(component.canSelectPlatform(task)).toBeFalsy();
    });

  });

  describe('Launch task', () => {

    beforeEach(() => {
      fixture.detectChanges();
    });

    it('Should call the right method service', () => {
      const spy = spyOn(tasksService, 'launchDefinition');
      component.form.get('platform').setValue('default');
      fixture.debugElement.query(By.css('#launch-task')).nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

  });


});
