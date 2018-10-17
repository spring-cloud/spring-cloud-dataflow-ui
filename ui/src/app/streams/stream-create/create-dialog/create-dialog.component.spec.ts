import { StreamCreateDialogComponent } from './create-dialog.component';
import { NgBusyModule } from 'ng-busy';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStreamsService } from '../../../tests/mocks/streams';
import { RouterTestingModule } from '@angular/router/testing';
import { StreamsService } from '../../streams.service';
import { FloModule } from 'spring-flo';
import { BsModalRef, ModalModule } from 'ngx-bootstrap';
import { ParserService } from '../../../shared/services/parser.service';
import { BusyService } from '../../../shared/services/busy.service';
import { LoggerService } from '../../../shared/services/logger.service';
import { MockNotificationService } from '../../../tests/mocks/notification';
import { NotificationService } from '../../../shared/services/notification.service';
import { SharedAboutService } from '../../../shared/services/shared-about.service';
import { MocksSharedAboutService } from '../../../tests/mocks/shared-about';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../../shared/shared.module';
import { By } from '@angular/platform-browser';
import { Observable } from 'rxjs/Observable';
import { throwError } from 'rxjs';
import { FeatureInfo } from '../../../shared/model/about/feature-info.model';
import { Platform } from '../../model/platform';

/**
 * Test {@link StreamCreateDialogComponent}.
 *
 * @author Alex Boyko
 */
describe('StreamCreateDialogComponent', () => {
  let component: StreamCreateDialogComponent;
  let fixture: ComponentFixture<StreamCreateDialogComponent>;
  const streamsService = new MockStreamsService();
  const busyService = new BusyService();
  const loggerService = new LoggerService();
  const parserService = new ParserService();
  const notificationService = new MockNotificationService();
  const aboutService = new MocksSharedAboutService();


  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [
        StreamCreateDialogComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        SharedModule,
        FormsModule,
        ReactiveFormsModule,
        ModalModule,
        FloModule,
        NgBusyModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: StreamsService, useValue: streamsService },
        { provide: BusyService, useValue: busyService },
        { provide: ParserService, useValue: parserService },
        { provide: LoggerService, useValue: loggerService },
        { provide: NotificationService, useValue: notificationService },
        { provide: SharedAboutService, useValue: aboutService },
        { provide: BsModalRef, useValue: null },
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamCreateDialogComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should be populate', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    component.open({ dsl: 'file | log' });
    expect(component).toBeTruthy();
  });

  it('default mocks: single deployment platform (skipper mode off, multiple platforms)', () => {
    fixture.detectChanges();
    const deployDiv = fixture.debugElement.query(By.css('.row .row-stream-deploy'));
    expect(deployDiv).toBeDefined();
  });

  it('skipper mode and multiple platforms => deploy checkbox is hidden', () => {
    const featureInfo = new FeatureInfo();
    featureInfo.skipperEnabled = true;
    spyOn(aboutService, 'getFeatureInfo').and.returnValue(Observable.of(featureInfo));
    fixture.detectChanges();
    const deployDiv = fixture.debugElement.query(By.css('.row .row-stream-deploy'));
    expect(deployDiv).toBeFalsy();
  });

  it('skipper mode on and single platform => deploy checkbox is shown', () => {
    const featureInfo = new FeatureInfo();
    featureInfo.skipperEnabled = true;
    spyOn(aboutService, 'getFeatureInfo').and.returnValue(Observable.of(featureInfo));
    spyOn(streamsService, 'getPlatforms').and.returnValue(Observable.of([
      new Platform('default', 'local')
    ]));
    fixture.detectChanges();
    const deployDiv = fixture.debugElement.query(By.css('.row .row-stream-deploy'));
    expect(deployDiv).toBeDefined();
  });

  // it('skipper mode errors out => deploy checkbox is hidden', () => {
  //   const featureInfo = new FeatureInfo();
  //   featureInfo.skipperEnabled = true;
  //   spyOn(aboutService, 'getFeatureInfo').and.returnValue(Observable.throw('Error'));
  //   fixture.detectChanges();
  //   const deployDiv = fixture.debugElement.query(By.css('.row .row-stream-deploy'));
  //   expect(deployDiv).toBeFalsy();
  // });

  it('platforms() call errors out => deploy checkbox is hidden', () => {
    spyOn(streamsService, 'getPlatforms').and.returnValue(throwError('Error'));
    fixture.detectChanges();
    const deployDiv = fixture.debugElement.query(By.css('.row .row-stream-deploy'));
    expect(deployDiv).toBeFalsy();
  });

});
