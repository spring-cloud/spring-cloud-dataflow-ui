import {ComponentFixture, TestBed, tick, waitForAsync} from '@angular/core/testing';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SecurityServiceMock} from '../../../tests/api/security.service.mock';
import {AboutServiceMock} from '../../../tests/api/about.service.mock';
import {NotificationServiceMock} from '../../../tests/service/notification.service.mock';
import {StreamServiceMock} from '../../../tests/api/stream.service.mock';
import {GrafanaServiceMock} from '../../../tests/service/grafana.service.mock';
import {CreateComponent} from './create.component';
import {AppServiceMock} from '../../../tests/api/app.service.mock';
import {MetamodelService} from '../../../flo/stream/metamodel.service';
import {ContentAssistServiceMock} from '../../../tests/api/content-assist.service.spec';
import {FloModule} from 'spring-flo';
import {ContextServiceMock} from '../../../tests/service/context.service.mock';
import {ParserService} from '../../../flo/shared/service/parser.service';
import {SanitizeDsl} from '../../../flo/stream/dsl-sanitize.service';
import {StreamService} from '../../../shared/api/stream.service';
import {of} from 'rxjs';
import {TranslateTestingModule} from 'ngx-translate-testing';
import TRANSLATIONS from '../../../../assets/i18n/en.json';

describe('streams/streams/create/create.component.ts', () => {
  let component: CreateComponent;
  let fixture: ComponentFixture<CreateComponent>;
  let streamService;
  const metamodelService = new MetamodelService(AppServiceMock.provider.useValue);
  beforeEach(waitForAsync(() => {
    streamService = new StreamServiceMock();
    streamService.getStream = () => of(null);
    TestBed.configureTestingModule({
      declarations: [CreateComponent],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        ClarityModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
        TranslateTestingModule.withTranslations('en', TRANSLATIONS),
        FloModule
      ],
      providers: [
        SecurityServiceMock.provider,
        AboutServiceMock.provider,
        NotificationServiceMock.provider,
        {provide: StreamService, useValue: streamService},
        GrafanaServiceMock.provider,
        {provide: MetamodelService, useValue: metamodelService},
        ContentAssistServiceMock.provider,
        ContextServiceMock.provider,
        ParserService,
        SanitizeDsl
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateComponent);
    component = fixture.componentInstance;
    component.flo.dsl = 'file|log';
    NotificationServiceMock.mock.clearAll();
  });

  it('should create a stream', async done => {
    await fixture.whenStable();
    fixture.detectChanges();
    component.canSubmit = () => true;
    component.createStream();
    await fixture.whenStable();
    fixture.detectChanges();
    component.form.get('0').setValue('foo');
    component.form.get('0_desc').setValue('bar');
    await fixture.whenStable();
    fixture.detectChanges();
    component.submit();
    await fixture.whenStable();
    fixture.detectChanges();
    expect(component.operationRunning).toBe('Creation completed');
    done();
  });
});
