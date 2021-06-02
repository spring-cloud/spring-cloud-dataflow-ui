import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorsComponent } from './errors.component';
import { SecurityServiceMock } from '../../../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../../../../tests/service/notification.service.mock';
import { RuntimeServiceMock } from '../../../../../tests/api/runtime.service.mock.spec';
import { GrafanaServiceMock } from '../../../../../tests/service/grafana.service.mock';
import { RoleDirective } from '../../../../../security/directive/role.directive';

describe('streams/deploy/builder/errors/errors.component.ts', () => {
  let component: ErrorsComponent;
  let fixture: ComponentFixture<ErrorsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        ErrorsComponent,
        RoleDirective
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        ClarityModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
      ],
      providers: [
        SecurityServiceMock.provider,
        AboutServiceMock.provider,
        NotificationServiceMock.provider,
        RuntimeServiceMock.provider,
        GrafanaServiceMock.provider,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorsComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should display errors', () => {
    component.errors = {
      global: [
        'foo'
      ],
      app: [
        'bar'
      ]
    };
    fixture.detectChanges();
    expect(component.getErrors()[0].type).toBe('app');
    expect(component.getErrors()[0].property).toBe('bar');
    expect(component.getErrors()[1].type).toBe('global');
    expect(component.getErrors()[1].property).toBe('foo');
  });

});
