import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {FormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SecurityServiceMock} from '../../../tests/api/security.service.mock';
import {AboutServiceMock} from '../../../tests/api/about.service.mock';
import {NotificationServiceMock} from '../../../tests/service/notification.service.mock';
import {StreamServiceMock} from '../../../tests/api/stream.service.mock';
import {StreamComponent} from './stream.component';
import {DestroyComponent} from '../destroy/destroy.component';
import {UndeployComponent} from '../undeploy/undeploy.component';
import {GrafanaStreamDirective} from '../../../shared/grafana/grafana.directive';
import {GrafanaServiceMock} from '../../../tests/service/grafana.service.mock';
import {throwError} from 'rxjs';
import {AppError} from '../../../shared/model/error.model';
import {HttpError} from '../../../shared/model/error.model';
import {RollbackComponent} from '../rollback/rollback.component';
import {By} from '@angular/platform-browser';
import {CardComponent} from '../../../shared/component/card/card.component';
import {DatetimePipe} from '../../../shared/pipe/datetime.pipe';
import {StreamDslComponent} from '../../../shared/component/stream-dsl/stream-dsl.component';
import {ParserService} from '../../../flo/shared/service/parser.service';
import {ContextServiceMock} from '../../../tests/service/context.service.mock';
import {TranslateTestingModule} from 'ngx-translate-testing';
import TRANSLATIONS from '../../../../assets/i18n/en.json';

describe('streams/streams/stream/stream.component.ts', () => {
  let component: StreamComponent;
  let fixture: ComponentFixture<StreamComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [
        StreamComponent,
        DestroyComponent,
        UndeployComponent,
        RollbackComponent,
        GrafanaStreamDirective,
        CardComponent,
        DatetimePipe,
        StreamDslComponent
      ],
      imports: [
        FormsModule,
        ClarityModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
        TranslateTestingModule.withTranslations('en', TRANSLATIONS)
      ],
      providers: [
        SecurityServiceMock.provider,
        AboutServiceMock.provider,
        NotificationServiceMock.provider,
        StreamServiceMock.provider,
        GrafanaServiceMock.provider,
        ContextServiceMock.provider,
        ParserService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
  });

  it('should be created', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    expect(component).toBeTruthy();
    expect(component.getAppType('time')).toBe('source');
    expect(component.getOrigin('time')).toBe('time');
    expect(component.hasLog('time')).toBe(false);
  });

  it('should navigate back', async () => {
    spyOn(StreamServiceMock.mock, 'getStream').and.callFake(() => throwError(new HttpError('Fake error', 404)));
    const navigate = spyOn((<any>component).router, 'navigateByUrl');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    expect(navigate).toHaveBeenCalledWith('streams/list');
  });

  it('should display the destroy modal', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('#btn-destroy')).nativeElement.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-stream-destroy .modal-title')).nativeElement).toBeTruthy();
  });

  it('should navigate to the deploy page', async () => {
    const navigate = spyOn((<any>component).router, 'navigateByUrl');
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('#btn-update')).nativeElement.click();
    fixture.detectChanges();
    expect(navigate).toHaveBeenCalledWith('streams/list/foo/deploy');
  });

  it('should display the undeploy modal', async () => {
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();
    fixture.debugElement.query(By.css('#btn-undeploy')).nativeElement.click();
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('app-stream-undeploy .modal-title')).nativeElement).toBeTruthy();
  });

  it('should catch API error and display a message', async () => {
    spyOn(StreamServiceMock.mock, 'getStream').and.callFake(() => throwError(new AppError('Fake error')));
    await fixture.whenStable();
    fixture.detectChanges();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    expect(NotificationServiceMock.mock.errorNotification[0].message.toString()).toBe('Fake error');
  });
});
