import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../../../tests/service/notification.service.mock';
import { RuntimeServiceMock } from '../../../../tests/api/runtime.service.mock.spec';
import { GrafanaServiceMock } from '../../../../tests/service/grafana.service.mock';
import { FreeTextComponent } from './free-text.component';
import { RoleDirective } from '../../../../security/directive/role.directive';
import { ContextServiceMock } from '../../../../tests/service/context.service.mock';

describe('streams/deploy/free-text/free-text.component.ts', () => {
  let component: FreeTextComponent;
  let fixture: ComponentFixture<FreeTextComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        FreeTextComponent,
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
        ContextServiceMock.provider
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FreeTextComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', () => {
    component.properties = ['foo=bar'];
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load a file', async (done) => {
    fixture.detectChanges();
    const event = { target: { files: [new Blob(['a=a'])] } };
    component.fileChange(event);
    setTimeout(() => {
      fixture.detectChanges();
      expect(component.formGroup.get('input').value).toContain('a=a');
      done();
    }, 500);
  });

});
