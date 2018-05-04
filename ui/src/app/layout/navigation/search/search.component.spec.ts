import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationSearchComponent } from './search.component';
import { MockAuthService } from '../../../tests/mocks/auth';
import { MocksSharedAboutService } from '../../../tests/mocks/shared-about';
import { MockAppsService } from '../../../tests/mocks/apps';
import { MockStreamsService } from '../../../tests/mocks/streams';
import { MockTasksService } from '../../../tests/mocks/tasks';
import { LogoComponent } from '../../logo/logo.component';
import { StreamStatusComponent } from '../../../streams/components/stream-status/stream-status.component';
import { AppTypeComponent } from '../../../apps/components/app-type/app-type.component';
import { TaskStatusComponent } from '../../../tasks/components/task-status/task-status.component';
import { RolesDirective } from '../../../auth/directives/roles.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedModule } from '../../../shared/shared.module';
import { SharedAboutService } from '../../../shared/services/shared-about.service';
import { AppsService } from '../../../apps/apps.service';
import { StreamsService } from '../../../streams/streams.service';
import { TasksService } from '../../../tasks/tasks.service';
import { AuthService } from '../../../auth/auth.service';

describe('NavigationSearchComponent', () => {
  let component: NavigationSearchComponent;
  let fixture: ComponentFixture<NavigationSearchComponent>;
  const authService = new MockAuthService();
  const aboutService = new MocksSharedAboutService();
  const appsService = new MockAppsService();
  const streamsService = new MockStreamsService();
  const tasksService = new MockTasksService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LogoComponent,
        NavigationSearchComponent,
        StreamStatusComponent,
        AppTypeComponent,
        TaskStatusComponent,
        RolesDirective
      ],
      imports: [
        CommonModule,
        FormsModule,
        ReactiveFormsModule,
        BrowserModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
        SharedModule,
        BsDropdownModule.forRoot(),
        ModalModule.forRoot()
      ],
      providers: [
        { provide: SharedAboutService, useValue: aboutService },
        { provide: AppsService, useValue: appsService },
        { provide: StreamsService, useValue: streamsService },
        { provide: TasksService, useValue: tasksService },
        { provide: AuthService, useValue: authService }
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NavigationSearchComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
