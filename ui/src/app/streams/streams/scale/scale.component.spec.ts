import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {ScaleComponent} from './scale.component';
import {Stream} from '../../../shared/model/stream.model';
import {RoleDirective} from '../../../security/directive/role.directive';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {ClarityModule} from '@clr/angular';
import {RouterTestingModule} from '@angular/router/testing';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {SecurityServiceMock} from '../../../tests/api/security.service.mock';
import {AboutServiceMock} from '../../../tests/api/about.service.mock';
import {NotificationServiceMock} from '../../../tests/service/notification.service.mock';
import {StreamServiceMock} from '../../../tests/api/stream.service.mock';
import {ContextServiceMock} from '../../../tests/service/context.service.mock';
import {By} from '@angular/platform-browser';
import {InstanceStatus} from '../../../shared/model/metrics.model';
import {of, throwError} from 'rxjs';
import TRANSLATIONS from '../../../../assets/i18n/en.json';
import {TranslateTestingModule} from 'ngx-translate-testing';

describe('ScaleComponent', () => {
  let component: ScaleComponent;
  let fixture: ComponentFixture<ScaleComponent>;
  let streams: Stream[];

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ScaleComponent, RoleDirective],
      imports: [
        FormsModule,
        ClarityModule,
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
        ReactiveFormsModule,
        TranslateTestingModule.withTranslations('en', TRANSLATIONS)
      ],
      providers: [
        SecurityServiceMock.provider,
        AboutServiceMock.provider,
        NotificationServiceMock.provider,
        StreamServiceMock.provider,
        ContextServiceMock.provider
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScaleComponent);
    component = fixture.componentInstance;
    NotificationServiceMock.mock.clearAll();
    streams = [Stream.parse({name: 'foo', dslText: 'file|log'}), Stream.parse({name: 'bar', dslText: 'file|log'})];
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should scale a stream', async () => {
    const statuses = [
      {
        name: 'foo',
        applications: [
          {
            name: 'file',
            deploymentId: 'file-v0',
            state: 'deployed',
            instances: [
              InstanceStatus.parse({guid: 'guid-0', index: 0, state: 'deployed'}),
              InstanceStatus.parse({guid: 'guid-1', index: 1, state: 'deployed'})
            ]
          },
          {
            name: 'log',
            deploymentId: 'log-v0',
            state: 'deployed',
            instances: [InstanceStatus.parse({guid: 'guid-1', index: '1', state: 'deployed'})]
          }
        ]
      }
    ];

    const spy1 = spyOn(StreamServiceMock.mock, 'getRuntimeStreamStatuses').and.returnValue(of(statuses));
    const spy2 = spyOn(StreamServiceMock.mock, 'scaleAppInstance').and.callThrough();

    component.open(streams[0].name);
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Scale instance(s) for app');

    await fixture.whenStable();
    fixture.detectChanges();
    const fileInput = fixture.debugElement.queryAll(By.css('input'))[0].nativeElement;
    const fileButton = fixture.debugElement.queryAll(By.css('.modal-body .btn-secondary'))[0].nativeElement;

    const logInput = fixture.debugElement.queryAll(By.css('input'))[1].nativeElement;
    const logButton = fixture.debugElement.queryAll(By.css('.modal-body .btn-secondary'))[1].nativeElement;

    expect(fileInput.value).toBe('2');
    expect(fileButton.disabled).toBe(true);
    expect(logInput.value).toBe('1');
    expect(logButton.disabled).toBe(true);

    fileInput.value = 3;
    fileInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(fileInput.value).toBe('3');
    expect(fileButton.disabled).toBe(false);
    expect(logInput.value).toBe('1');
    expect(logButton.disabled).toBe(true);

    fileButton.click();

    await fixture.whenStable();
    fixture.detectChanges();
    expect(NotificationServiceMock.mock.successNotifications[0].title).toBe('Scale stream');
    expect(NotificationServiceMock.mock.successNotifications[0].message).toBe('file app scaled to 3.');
    expect(spy1).toHaveBeenCalledWith(['foo']);
    expect(spy2).toHaveBeenCalledWith('foo', 'file', 3);
  });

  it('should display an error', async () => {
    const spy1 = spyOn(StreamServiceMock.mock, 'getRuntimeStreamStatuses').and.callFake(() =>
      throwError(new Error('Fake error'))
    );

    component.open(streams[0].name);

    await fixture.whenStable();
    fixture.detectChanges();

    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    expect(NotificationServiceMock.mock.errorNotification[0].message).toBe(
      'An error occurred while fetching Stream runtime statuses. Please check the server logs for more details.'
    );
    expect(spy1).toHaveBeenCalledWith(['foo']);
  });

  it('should display an error when scaling', async () => {
    const statuses = [
      {
        name: 'foo',
        applications: [
          {
            name: 'file',
            deploymentId: 'file-v0',
            state: 'deployed',
            instances: [
              InstanceStatus.parse({guid: 'guid-0', index: 0, state: 'deployed'}),
              InstanceStatus.parse({guid: 'guid-1', index: 1, state: 'deployed'})
            ]
          },
          {
            name: 'log',
            deploymentId: 'log-v0',
            state: 'deployed',
            instances: [InstanceStatus.parse({guid: 'guid-1', index: '1', state: 'deployed'})]
          }
        ]
      }
    ];

    const spy1 = spyOn(StreamServiceMock.mock, 'getRuntimeStreamStatuses').and.returnValue(of(statuses));
    const spy2 = spyOn(StreamServiceMock.mock, 'scaleAppInstance').and.callFake(() =>
      throwError(new Error('Fake error'))
    );

    component.open(streams[0].name);
    fixture.detectChanges();
    const title = fixture.debugElement.query(By.css('.modal-title-wrapper')).nativeElement;
    expect(title.textContent).toContain('Scale instance(s) for app');

    await fixture.whenStable();
    fixture.detectChanges();
    const fileInput = fixture.debugElement.queryAll(By.css('input'))[0].nativeElement;
    const fileButton = fixture.debugElement.queryAll(By.css('.modal-body .btn-secondary'))[0].nativeElement;

    const logInput = fixture.debugElement.queryAll(By.css('input'))[1].nativeElement;
    const logButton = fixture.debugElement.queryAll(By.css('.modal-body .btn-secondary'))[1].nativeElement;

    expect(fileInput.value).toBe('2');
    expect(fileButton.disabled).toBe(true);
    expect(logInput.value).toBe('1');
    expect(logButton.disabled).toBe(true);

    fileInput.value = 3;
    fileInput.dispatchEvent(new Event('input'));

    fixture.detectChanges();

    expect(fileInput.value).toBe('3');
    expect(fileButton.disabled).toBe(false);
    expect(logInput.value).toBe('1');
    expect(logButton.disabled).toBe(true);

    fileButton.click();

    await fixture.whenStable();
    fixture.detectChanges();
    expect(NotificationServiceMock.mock.errorNotification[0].title).toBe('An error occurred');
    expect(spy1).toHaveBeenCalledWith(['foo']);
    expect(spy2).toHaveBeenCalledWith('foo', 'file', 3);
  });
});
