import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { BusyModule } from 'tixif-ngx-busy';
import { FormsModule } from '@angular/forms';

import { LoginComponent } from './login.component';
import { ToastyService } from 'ng2-toasty';
import { MockToastyService } from '../tests/mocks/toasty';
import { MockActivatedRoute } from '../tests/mocks/activated-route';
import { ActivatedRoute } from '@angular/router';
import { MockAboutService } from '../tests/mocks/about';
import { MockAuthService } from '../tests/mocks/auth';

import { AuthService } from './auth.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { Observable } from 'rxjs/Observable';
import { Router } from '@angular/router';
import { AboutService } from '../about/about.service';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  const toastyService = new MockToastyService();
  let activeRoute: MockActivatedRoute;
  const authService = new MockAuthService();
  const aboutService = new MockAboutService();

  beforeEach( async(() => {
    activeRoute = new MockActivatedRoute();
    TestBed.configureTestingModule({
      imports: [
        BusyModule,
        FormsModule,
        RouterTestingModule.withRoutes([])
      ],
      declarations:   [ LoginComponent ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: AboutService, useValue: aboutService },
        { provide: ToastyService, useValue: toastyService },
        { provide: ActivatedRoute, useValue: {
            params: Observable.of({returnUrl: '/apps'})
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

    expect(el.innerHTML).toBe('Login');

    const usernameField: HTMLElement = fixture.debugElement.query(By.css('#username')).nativeElement;
    expect(usernameField.getAttribute('placeholder')).toBe('<Username>');

    const passwordField: HTMLElement = fixture.debugElement.query(By.css('#password')).nativeElement;
    expect(passwordField.getAttribute('placeholder')).toBe('<Password>');

    const loginButton: any = fixture.debugElement.query(By.css('#loginButton')).nativeElement;
    expect(loginButton.innerHTML).toBe('Sign in');

    const logoutButton: DebugElement = fixture.debugElement.query(By.css('#logoutButton'));
    expect(logoutButton).toBe(null);
    const backButton: DebugElement = fixture.debugElement.query(By.css('#logoutButton'));
    expect(backButton).toBe(null);

  });
});
