import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgxPaginationModule } from 'ngx-pagination';
import {
  BsDatepickerModule, BsDropdownModule, BsModalService, ModalModule, PopoverModule,
  TooltipModule
} from 'ngx-bootstrap';
import { MockNotificationService } from '../../tests/mocks/notification';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
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
import { MockGroupRouteService } from '../../tests/mocks/group-route';
import { GroupRouteService } from '../../shared/services/group-route.service';
import { StreamDslComponent } from '../../shared/components/dsl/dsl.component';
import { MockRoutingStateService } from '../../tests/mocks/routing-state';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { ActivatedRoute } from '@angular/router';
import { TASK_SCHEDULES } from '../../tests/mocks/mock-data';
import { TaskScheduleComponent } from './task-schedule.component';
import { MockModalService } from '../../tests/mocks/modal';
import { LoggerService } from '../../shared/services/logger.service';
import { By } from '@angular/platform-browser';
import { DATAFLOW_LIST } from 'src/app/shared/components/list/list.component';
import { PagerComponent } from 'src/app/shared/components/pager/pager.component';
import { DATAFLOW_PAGE } from '../../shared/components/page/page.component';
import { TippyDirective } from '../../shared/directives/tippy.directive';

/**
 * Test {@link TaskScheduleComponent}.
 *
 * @author Damien Vitrac
 */
describe('TaskScheduleComponent', () => {
  let component: TaskScheduleComponent;
  let fixture: ComponentFixture<TaskScheduleComponent>;
  const notificationService = new MockNotificationService();
  const tasksService = new MockTasksService();
  const authService = new MockAuthService();
  const aboutService = new MocksSharedAboutService();
  const groupRouteService = new MockGroupRouteService();
  const routingStateService = new MockRoutingStateService();
  const modalServie = new MockModalService();
  const loggerService = new LoggerService();
  const commonTestParams = { id: 'foo1' };
  let activeRoute: MockActivatedRoute;

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [
        RolesDirective,
        TruncatePipe,
        LoaderComponent,
        TaskScheduleComponent,
        StreamDslComponent,
        DATAFLOW_PAGE,
        DATAFLOW_LIST,
        PagerComponent,
        TippyDirective
      ],
      imports: [
        NgxPaginationModule,
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
        BsDatepickerModule.forRoot(),
        TooltipModule.forRoot(),
        FormsModule,
        FloModule,
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: SharedAboutService, useValue: aboutService },
        { provide: AuthService, useValue: authService },
        { provide: ActivatedRoute, useValue: activeRoute },
        { provide: BsModalService, useValue: modalServie },
        { provide: TasksService, useValue: tasksService },
        { provide: LoggerService, useValue: loggerService },
        { provide: GroupRouteService, useValue: groupRouteService },
        { provide: RoutingStateService, useValue: routingStateService },
        { provide: NotificationService, useValue: notificationService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    tasksService.taskSchedules = TASK_SCHEDULES;
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(TaskScheduleComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Actions', () => {

    it('should call the delete schedule method', () => {
      fixture.detectChanges();
      const bt: HTMLElement = fixture.debugElement.query(By.css('#schedule-remove')).nativeElement;
      const spy = spyOn(component, 'destroy');
      bt.click();
      expect(spy).toHaveBeenCalled();
    });

    /*
    TODO: fix it
    it('should call the routing history service on cancel', () => {
      fixture.detectChanges();
      const bt: HTMLElement = fixture.debugElement.query(By.css('#back-button')).nativeElement;
      const spy = spyOn(routingStateService, 'back');
      bt.click();
      expect(spy).toHaveBeenCalledWith('/tasks/schedules', /^(\/tasks\/schedules\/)/);
    });
    */

  });

});
