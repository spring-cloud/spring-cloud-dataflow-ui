import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NgBusyModule } from 'ng-busy';
import { MockNotificationService } from '../../tests/mocks/notification';
import { MockStreamsService } from '../../tests/mocks/streams';
import { StreamsService } from '../streams.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { ActivatedRoute } from '@angular/router';
import { StreamDeployComponent } from './stream-deploy.component';
import { MockComponent } from '../../tests/mocks/mock-component';
import { MocksSharedAboutService } from '../../tests/mocks/shared-about';
import { SharedAboutService } from '../../shared/services/shared-about.service';
import { BusyService } from '../../shared/services/busy.service';
import { ModalModule, TooltipModule } from 'ngx-bootstrap';
import { AppTypeComponent } from '../../apps/components/app-type/app-type.component';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';

/**
 * Test {@link StreamDeployComponent}.
 *
 * @author Glenn Renfro
 */
xdescribe('StreamDeployComponent', () => {
  let component: StreamDeployComponent;
  let fixture: ComponentFixture<StreamDeployComponent>;
  const notificationService = new MockNotificationService();
  const streamsService = new MockStreamsService();
  const sharedAboutService = new MocksSharedAboutService();
  const busyService = new BusyService();
  let activeRoute: MockActivatedRoute;
  const commonTestParams = { id: '1' };
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [
        StreamDeployComponent,
        AppTypeComponent
      ],
      imports: [
        NgBusyModule,
        FormsModule,
        ReactiveFormsModule,
        TooltipModule.forRoot(),
        ModalModule.forRoot(),
        RouterTestingModule.withRoutes([{ path: 'streams/definitions', component: MockComponent }])
      ],
      providers: [
        { provide: BusyService, useValue: busyService },
        { provide: StreamsService, useValue: streamsService },
        { provide: ActivatedRoute, useValue: activeRoute },
        { provide: SharedAboutService, useValue: sharedAboutService },
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(StreamDeployComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
  /*
    it('Should execute deploy for stream', () => {
      streamsService.streamDefinitions = STREAM_DEFINITIONS;
      fixture.detectChanges();
      const de: DebugElement = fixture.debugElement.query(By.css('button[id=deployBtn]'));
      const el: HTMLElement = de.nativeElement;
      const navigate = spyOn((<any>component).router, 'navigate');
      el.click();

      expect(navigate).toHaveBeenCalledWith(['streams/definitions']);
      expect(notificationService.testSuccess).toContain('Successfully deployed stream definition "1"');
    });

    it('Should execute deploy for stream with properties', () => {
      streamsService.streamDefinitions = STREAM_DEFINITIONS;
      fixture.detectChanges();
      const de: DebugElement = fixture.debugElement.query(By.css('button[id=deployBtn]'));
      const el: HTMLElement = de.nativeElement;
      const navigate = spyOn((<any>component).router, 'navigate');
      component.deploymentProperties.setValue('app.bar=foo\napp.aaa=bbb=ccc\napp.ddd=eee');
      el.click();
      expect(component.propertiesAsMap['app.bar']).toBe('foo');
      expect(component.propertiesAsMap['app.aaa']).toBe('bbb=ccc');
      expect(component.propertiesAsMap['app.ddd']).toBe('eee');

      expect(navigate).toHaveBeenCalledWith(['streams/definitions']);
      expect(notificationService.testSuccess).toContain('Successfully deployed stream definition "1"');
    });

    it('Should return back to stream definitions page', () => {
      streamsService.streamDefinitions = STREAM_DEFINITIONS;
      fixture.detectChanges();
      const de: DebugElement = fixture.debugElement.query(By.css('button[id=backBtn]'));
      const el: HTMLElement = de.nativeElement;
      const navigate = spyOn((<any>component).router, 'navigate');
      el.click();

      expect(navigate).toHaveBeenCalledWith(['streams/definitions']);
      expect(notificationService.testSuccess.length).toBe(0);
    });*/
});
