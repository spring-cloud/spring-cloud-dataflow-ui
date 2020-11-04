import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RuntimeComponent } from './runtime.component';
import { SecurityServiceMock } from '../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../tests/service/notification.service.mock';
import { RuntimeServiceMock } from '../../tests/api/runtime.service.mock.spec';
import { DetailsComponent } from './details/details.component';
import { By } from '@angular/platform-browser';
import { GrafanaRuntimeAppDirective, GrafanaRuntimeInstanceDirective } from '../../shared/grafana/grafana.directive';
import { GrafanaServiceMock } from '../../tests/service/grafana.service.mock';
import { ContextServiceMock } from '../../tests/service/context.service.mock';

describe('streams/runtime/runtime.component.ts', () => {

  let component: RuntimeComponent;
  let fixture: ComponentFixture<RuntimeComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        RuntimeComponent,
        DetailsComponent,
        GrafanaRuntimeAppDirective,
        GrafanaRuntimeInstanceDirective
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
        RuntimeServiceMock.provider,
        GrafanaServiceMock.provider,
        ContextServiceMock.provider
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RuntimeComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show the detail runtime', async (done) => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component).toBeTruthy();
    component.details(component.page.items[0].apps[0]);
    fixture.detectChanges();
    const modal = fixture.debugElement.query(By.css('app-runtime-details'));
    expect(modal).toBeTruthy();
    const title = modal.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Instances for app');
    done();
  });

});
