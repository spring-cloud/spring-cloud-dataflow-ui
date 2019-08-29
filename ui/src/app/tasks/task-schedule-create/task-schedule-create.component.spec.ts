import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import { BsDatepickerModule, BsDropdownModule, ModalModule, PopoverModule, TooltipModule } from 'ngx-bootstrap';
import { MockNotificationService } from '../../tests/mocks/notification';
import { FormArray, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { RolesDirective } from '../../auth/directives/roles.directive';
import { MockAuthService } from '../../tests/mocks/auth';
import { AuthService } from '../../auth/auth.service';
import { FloModule } from 'spring-flo';
import { MocksSharedAboutService } from '../../tests/mocks/shared-about';
import { SharedAboutService } from '../../shared/services/shared-about.service';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { TasksService } from '../tasks.service';
import { MockTasksService } from '../../tests/mocks/tasks';
import { NotificationService } from '../../shared/services/notification.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { TaskScheduleCreateComponent } from './task-schedule-create.component';
import { MockGroupRouteService } from '../../tests/mocks/group-route';
import { GroupRouteService } from '../../shared/services/group-route.service';
import { StreamDslComponent } from '../../shared/components/dsl/dsl.component';
import { MockRoutingStateService } from '../../tests/mocks/routing-state';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { ActivatedRoute } from '@angular/router';
import { TASK_DEFINITIONS, TASK_SCHEDULES } from '../../tests/mocks/mock-data';
import { By } from '@angular/platform-browser';
import { DATAFLOW_PAGE } from '../../shared/components/page/page.component';
import { DATAFLOW_LIST } from '../../shared/components/list/list.component';
import { PagerComponent } from 'src/app/shared/components/pager/pager.component';
import { KvRichTextComponent } from '../../shared/components/kv-rich-text/kv-rich-text.component';
import { ClipboardModule, ClipboardService } from 'ngx-clipboard';
import { BlockerService } from '../../shared/components/blocker/blocker.service';
import { TippyDirective } from '../../shared/directives/tippy.directive';

/**
 * Test {@link TaskScheduleCreateComponent}.
 *
 * @author Damien Vitrac
 */
describe('TaskScheduleCreateComponent', () => {
  let component: TaskScheduleCreateComponent;
  let fixture: ComponentFixture<TaskScheduleCreateComponent>;
  const notificationService = new MockNotificationService();
  const tasksService = new MockTasksService();
  const authService = new MockAuthService();
  const aboutService = new MocksSharedAboutService();
  const groupRouteService = new MockGroupRouteService();
  const routingStateService = new MockRoutingStateService();
  const commonTestParams = { id: 'foo' };
  let activeRoute: MockActivatedRoute;

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      declarations: [
        RolesDirective,
        TruncatePipe,
        LoaderComponent,
        TaskScheduleCreateComponent,
        StreamDslComponent,
        DATAFLOW_PAGE,
        DATAFLOW_LIST,
        PagerComponent,
        KvRichTextComponent,
        TippyDirective
      ],
      imports: [
        NgxPaginationModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TooltipModule.forRoot(),
        PopoverModule.forRoot(),
        FormsModule,
        FloModule,
        ReactiveFormsModule,
        ClipboardModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: SharedAboutService, useValue: aboutService },
        { provide: AuthService, useValue: authService },
        { provide: ActivatedRoute, useValue: activeRoute },
        { provide: TasksService, useValue: tasksService },
        { provide: GroupRouteService, useValue: groupRouteService },
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
    tasksService.taskSchedules = TASK_SCHEDULES;
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(TaskScheduleCreateComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should fill the form and call the service for the creation on submit', () => {
    fixture.detectChanges();
    (component.form.get('names') as FormArray).controls[0].setValue('myschedule');
    component.form.get('cron').setValue('0 0 0 0 0');
    fixture.detectChanges();
    fixture.debugElement.query(By.css('#btn-submit')).nativeElement.click();
    expect(notificationService.testSuccess[0]).toContain('Successfully schedule creation');
    expect(notificationService.testSuccess[0]).toContain('myschedule');
  });

  describe('errors', () => {

    beforeEach(() => {
      component.submitted = true;
    });

    it('should display an error for the required name', () => {
      fixture.detectChanges();
      (component.form.get('names') as FormArray).controls[0].setValue('');
      component.form.get('cron').setValue('0 0 0 0 0');
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.errors-name')).nativeElement.textContent).toContain('The name is required.');
    });

    it('should display an error for the required cron expression', () => {
      fixture.detectChanges();
      (component.form.get('names') as FormArray).controls[0].setValue('myschedule');
      component.form.get('cron').setValue('');
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.errors-cron')).nativeElement.textContent).toContain('The cron expression is required.');
    });

    it('should display an error for the unique name', () => {
      fixture.detectChanges();
      (component.form.get('names') as FormArray).controls[0].setValue('foo1');
      component.form.get('cron').setValue('0 0 0 0 0');
      fixture.detectChanges();
      expect(fixture.debugElement.query(By.css('.errors-name')).nativeElement.textContent).toContain('The name already exists.');
    });

  });

});
