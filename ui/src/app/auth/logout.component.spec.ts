import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { LogoutComponent } from './logout.component';
import { MockNotificationService } from '../tests/mocks/notification';
import { MockActivatedRoute } from '../tests/mocks/activated-route';
import { ActivatedRoute } from '@angular/router';
import { MockAboutService } from '../tests/mocks/about';
import { MockAuthService } from '../tests/mocks/auth';
import { AuthService } from './auth.service';
import { RouterTestingModule } from '@angular/router/testing';
import { AboutService } from '../about/about.service';
import { NotificationService } from '../shared/services/notification.service';
import { LoggerService } from '../shared/services/logger.service';
import { of } from 'rxjs';

describe('LogoutComponent', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;
  const notificationService = new MockNotificationService();
  let activeRoute: MockActivatedRoute;
  const authService = new MockAuthService();
  const aboutService = new MockAboutService();
  const loggerService = new LoggerService();

  beforeEach( async(() => {
    activeRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      imports: [
        FormsModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations:   [ LogoutComponent ],
      providers: [
        { provide: AboutService, useValue: aboutService },
        { provide: AuthService, useValue: authService },
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService },
        { provide: ActivatedRoute, useValue: {
            params: of({returnUrl: '/apps'})
          }
        }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
  });

  it('Logout should call logout on the auth service if authentication is'
    + ' enabled and the user is authenticated.', () => {

    authService.securityInfo.isAuthenticated = true;
    authService.securityInfo.username = 'Berlin';

    const navigate = spyOn((<any>component).router, 'navigate');
    const logout = spyOn(authService as AuthService, 'logout').and.callThrough();

    spyOn(window, 'open');

    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(authService.securityInfo.isAuthenticated).toBe(false);
    expect(authService.securityInfo.username).toEqual('');
    expect(window.open).toHaveBeenCalledWith('//' + window.location.host + '/logout', '_self');
  });

  it('Logout should just redirect to the root of the app as '
    + 'authentication is not enabled.', () => {

    authService.securityInfo.isAuthenticationEnabled = false;

    const navigate = spyOn((<any>component).router, 'navigate');
    const logout = spyOn(authService as AuthService, 'logout').and.callThrough();

    fixture.detectChanges();

    expect(navigate).toHaveBeenCalledWith(['']);
    expect(logout).not.toHaveBeenCalled();
  });

  it('Logout should just redirect to the root of the app as '
    + 'the user is not authenticated.', () => {

    authService.securityInfo.isAuthenticated = false;
    const navigate = spyOn((<any>component).router, 'navigate');
    const logout = spyOn(authService as AuthService, 'logout').and.callThrough();

    fixture.detectChanges();

    expect(navigate).toHaveBeenCalledWith(['']);
    expect(logout).not.toHaveBeenCalled();
  });
});
