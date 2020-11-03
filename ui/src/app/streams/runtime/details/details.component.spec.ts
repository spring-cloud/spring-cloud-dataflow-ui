import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { DetailsComponent } from './details.component';
import { GrafanaRuntimeAppDirective, GrafanaRuntimeInstanceDirective } from '../../../shared/grafana/grafana.directive';
import { FormsModule } from '@angular/forms';
import { ClarityModule } from '@clr/angular';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SecurityServiceMock } from '../../../tests/api/security.service.mock';
import { AboutServiceMock } from '../../../tests/api/about.service.mock';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';
import { RuntimeServiceMock } from '../../../tests/api/runtime.service.mock.spec';
import { GrafanaServiceMock } from '../../../tests/service/grafana.service.mock';
import { RuntimeStreamPage } from '../../../shared/model/runtime.model';
import { GET_RUNTIME } from '../../../tests/data/runtime';
import { By } from '@angular/platform-browser';
import { ContextServiceMock } from '../../../tests/service/context.service.mock';

describe('streams/runtime/details/details.component.ts', () => {

  let component: DetailsComponent;
  let fixture: ComponentFixture<DetailsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        DetailsComponent,
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
    fixture = TestBed.createComponent(DetailsComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should show the runtime application(s)', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    component.open(RuntimeStreamPage.parse(GET_RUNTIME).items[0].apps[0]);
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Instances for app');
  });

});
