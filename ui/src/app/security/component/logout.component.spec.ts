import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../tests/api/about.service.mock';
import { AppServiceMock } from '../../tests/api/app.service.mock';
import { NotificationServiceMock } from '../../tests/service/notification.service.mock';
import { ContextService } from '../../shared/service/context.service';
import { LogoutComponent } from './logout.component';

describe('security/component/logout.component.ts', () => {
  let component: LogoutComponent;
  let fixture: ComponentFixture<LogoutComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LogoutComponent,
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
        AppServiceMock.provider,
        NotificationServiceMock.provider,
        ContextService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogoutComponent);
    component = fixture.componentInstance;
  });

  it('should redirect to the home', () => {
    const navigate = spyOn((<any>component).router, 'navigate');
    SecurityServiceMock.mock.security.isAuthenticationEnabled = true;
    SecurityServiceMock.mock.security.isAuthenticated = false;
    SecurityServiceMock.mock.security.username = 'foo';
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(navigate).toHaveBeenCalled();
  });

  it('should redirect to the home', () => {
    const navigate = spyOn((<any>component).router, 'navigate');
    SecurityServiceMock.mock.security.isAuthenticationEnabled = false;
    SecurityServiceMock.mock.security.isAuthenticated = false;
    SecurityServiceMock.mock.security.username = 'foo';
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(navigate).toHaveBeenCalled();
  });

  it('should open the logout window', async (done) => {
    const w = spyOn(window, 'open');
    SecurityServiceMock.mock.security.isAuthenticationEnabled = true;
    SecurityServiceMock.mock.security.isAuthenticated = true;
    SecurityServiceMock.mock.security.username = 'foo';
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(w).toHaveBeenCalled();
    done();
  });

});
