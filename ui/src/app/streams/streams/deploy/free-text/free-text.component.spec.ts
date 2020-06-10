import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../../../tests/service/notification.service.mock';
import { RuntimeServiceMock } from '../../../../tests/api/runtime.service.mock.spec';
import { GrafanaServiceMock } from '../../../../tests/service/grafana.service.mock';
import { ContextService } from '../../../../shared/service/context.service';
import { FreeTextComponent } from './free-text.component';

describe('streams/deploy/free-text/free-text.component.ts', () => {
  let component: FreeTextComponent;
  let fixture: ComponentFixture<FreeTextComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FreeTextComponent,
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
        ContextService
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
