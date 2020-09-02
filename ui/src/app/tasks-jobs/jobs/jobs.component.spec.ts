import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AboutServiceMock } from '../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../tests/service/notification.service.mock';
import { SecurityServiceMock } from '../../tests/api/security.service.mock';
import { RoleDirective } from '../../security/directive/role.directive';
import { JobsComponent } from './jobs.component';
import { JobServiceMock } from '../../tests/api/job.service.mock';
import { StopComponent } from '../executions/stop/stop.component';
import { ConfirmComponent } from '../../shared/component/confirm/confirm.component';
import { ContextServiceMock } from '../../tests/service/context.service.mock';

describe('tasks-jobs/jobs/jobs.component.ts', () => {

  let component: JobsComponent;
  let fixture: ComponentFixture<JobsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        JobsComponent,
        StopComponent,
        ConfirmComponent,
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
        JobServiceMock.provider,
        ContextServiceMock.provider,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(JobsComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
