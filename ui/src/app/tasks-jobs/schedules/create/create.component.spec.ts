import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { RoleDirective } from '../../../security/directive/role.directive';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { ScheduleServiceMock } from '../../../tests/api/schedule.service.mock';
import { TaskServiceMock } from '../../../tests/api/task.service.mock';
import { CreateComponent } from './create.component';
import { GroupServiceMock } from '../../../tests/service/group.service.mock';
import { ContextServiceMock } from '../../../tests/service/context.service.mock';

describe('tasks-jobs/schedules/create/create.component.ts', () => {

  let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        CreateComponent,
        RoleDirective
      ],
      imports: [
        FormsModule,
        ClarityModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
      ],
      providers: [
        SecurityServiceMock.provider,
        AboutServiceMock.provider,
        NotificationServiceMock.provider,
        ScheduleServiceMock.provider,
        TaskServiceMock.provider,
        GroupServiceMock.provider,
        ContextServiceMock.provider
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
