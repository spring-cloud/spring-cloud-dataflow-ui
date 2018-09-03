import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BsDropdownModule, ModalModule } from 'ngx-bootstrap';
import { MocksSharedAboutService } from '../../tests/mocks/shared-about';
import { SharedAboutService } from '../../shared/services/shared-about.service';
import { MockAuthService } from '../../tests/mocks/auth';
import { AuthService } from '../../auth/auth.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { CommonModule } from '@angular/common';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NavigationComponent } from './navigation.component';
import { RolesDirective } from '../../auth/directives/roles.directive';
import { RouterTestingModule } from '@angular/router/testing';
import { LogoComponent } from '../logo/logo.component';
import { NavigationSearchComponent } from './search/search.component';
import { StreamStatusComponent } from '../../streams/components/stream-status/stream-status.component';
import { AppTypeComponent } from '../../apps/components/app-type/app-type.component';
import { TaskStatusComponent } from '../../tasks/components/task-status/task-status.component';
import { MockTasksService } from '../../tests/mocks/tasks';
import { MockStreamsService } from '../../tests/mocks/streams';
import { MockAppsService } from '../../tests/mocks/apps';
import { AppsService } from '../../apps/apps.service';
import { StreamsService } from '../../streams/streams.service';
import { TasksService } from '../../tasks/tasks.service';

xdescribe('NavigationComponent', () => {
  let component: NavigationComponent;
  let fixture: ComponentFixture<NavigationComponent>;
  const authService = new MockAuthService();
  const aboutService = new MocksSharedAboutService();
  const appsService = new MockAppsService();
  const streamsService = new MockStreamsService();
  const tasksService = new MockTasksService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        NavigationComponent,
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
    fixture = TestBed.createComponent(NavigationComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
