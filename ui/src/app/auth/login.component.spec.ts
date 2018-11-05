import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgBusyModule } from 'ng-busy';
import { FormsModule } from '@angular/forms';
import { LoginComponent } from './login.component';
import { MockNotificationService } from '../tests/mocks/notification';
import { MockActivatedRoute } from '../tests/mocks/activated-route';
import { ActivatedRoute } from '@angular/router';
import { MockAboutService } from '../tests/mocks/about';
import { MockAuthService } from '../tests/mocks/auth';
import { AuthService } from './auth.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';
import { AboutService } from '../about/about.service';
import { BusyService } from '../shared/services/busy.service';
import { NotificationService } from '../shared/services/notification.service';
import { LoggerService } from '../shared/services/logger.service';
import { DATAFLOW_LIST } from 'src/app/shared/components/list/list.component';
import { DATAFLOW_PAGE } from 'src/app/shared/components/page/page.component';
import { BsDropdownModule, TooltipModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { FocusDirective } from '../shared/directives/focus.directive';
import { PagerComponent } from '../shared/components/pager/pager.component';
import { of } from 'rxjs';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const notificationService = new MockNotificationService();
  let activeRoute: MockActivatedRoute;
  const authService = new MockAuthService();
  const aboutService = new MockAboutService();
  const busyService = new BusyService();
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      imports: [
        NgBusyModule,
        FormsModule,
        RouterTestingModule.withRoutes([]),
        BsDropdownModule.forRoot(),
        TooltipModule.forRoot(),
        NgxPaginationModule
      ],
      declarations: [
        LoginComponent,
        FocusDirective,
        PagerComponent,
        DATAFLOW_PAGE,
        DATAFLOW_LIST
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: BusyService, useValue: busyService },
        { provide: AboutService, useValue: aboutService },
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService },
        {
          provide: ActivatedRoute, useValue: {
          params: of({ returnUrl: '/apps' })
        }
        },
        {
          provide: Router,
          useClass: class {
            navigate = jasmine.createSpy('navigate');
          }
        }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
  });

  it('Should be in un-authenticated state.', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();

    const de: DebugElement = fixture.debugElement.query(By.css('h1'));
    const el: HTMLElement = de.nativeElement;

    expect(el.innerHTML).toContain('Login');

    const usernameField: HTMLElement = fixture.debugElement.query(By.css('#username')).nativeElement;
    expect(usernameField.getAttribute('placeholder')).toBe('<Username>');

    const passwordField: HTMLElement = fixture.debugElement.query(By.css('#password')).nativeElement;
    expect(passwordField.getAttribute('placeholder')).toBe('<Password>');

    const loginButton: any = fixture.debugElement.query(By.css('#loginButton')).nativeElement;
    expect(loginButton.innerHTML).toContain('Sign in');

    const logoutButton: DebugElement = fixture.debugElement.query(By.css('#logoutButton'));
    expect(logoutButton).toBe(null);
    const backButton: DebugElement = fixture.debugElement.query(By.css('#logoutButton'));
    expect(backButton).toBe(null);

  });
});
