import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { MetamodelService } from '../metamodel.service';
import { MockSharedAppService } from '../../../tests/service/app.service.mock';
import { ParserService } from '../../shared/service/parser.service';
import { LoggerService } from '../../../shared/service/logger.service';
import { StreamsModule } from '../../../streams/streams.module';
import { NotificationService } from '../../../shared/service/notification.service';
import { StreamFloCreateComponent } from './create.component';
import { SharedModule } from '../../../shared/shared.module';
import { StreamService } from '../../../shared/api/stream.service';
import { MockStreamsService } from '../../../tests/service/stream.service.mock';
import { NotificationServiceMock } from '../../../tests/service/notification.service.mock';

/**
 * Test {@link StreamCreateComponent}.
 *
 * @author Glenn Renfro
 */
describe('StreamCreateComponent', () => {
  let component: StreamFloCreateComponent;
  let fixture: ComponentFixture<StreamFloCreateComponent>;
  const streamsService = new MockStreamsService();
  const metamodelService = new MetamodelService(new MockSharedAppService());
  const parserService = new ParserService();
  const loggerService = new LoggerService();
  const notificationService = new NotificationServiceMock();

  // const commonTestParams = { id: '1' };

  beforeEach(async () => {
    // activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule.withRoutes([]),
        BrowserAnimationsModule,
        SharedModule,
        StreamsModule,
        StoreModule.forRoot({}),
        EffectsModule.forRoot([])
      ],
      providers: [
        { provide: StreamService, useValue: streamsService },
        { provide: MetamodelService, useValue: metamodelService },
        { provide: NotificationService, useValue: notificationService },
        { provide: ParserService, useValue: parserService },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamFloCreateComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  xit('disable stream creation for empty streams', () => {
    fixture.detectChanges();
    expect(component.dsl).toBeUndefined();
    expect(component.isCreateStreamsDisabled).toBeTruthy();
  });

  it('enable stream creation for valid stream', (done) => {
    fixture.detectChanges();
    expect(component.isCreateStreamsDisabled).toBeTruthy();
    component.dsl = 'http | ftp';
    fixture.detectChanges();
    // Validation is performed after a delay, hence the wait
    setTimeout(() => {
      expect(component.dsl).toEqual('http | ftp');
      expect(component.parseErrors).toEqual([]);
      const allMarkers = [];
      Array.from(component.validationMarkers.values()).forEach(markers => allMarkers.push(...markers));
      expect(allMarkers.length).toEqual(0);
      expect(component.isCreateStreamsDisabled).toBeFalsy();
      done();
    }, 1000);
  });

  it('disable stream creation for parse error', (done) => {
    fixture.detectChanges();
    expect(component.isCreateStreamsDisabled).toBeTruthy();
    component.dsl = 'http -ghdfv | ftp';
    fixture.detectChanges();
    // Validation is performed after a delay, hence the wait
    setTimeout(() => {
      expect(component.dsl).toEqual('http -ghdfv | ftp');
      expect(component.parseErrors.length).toEqual(1);
      const allMarkers = [];
      Array.from(component.validationMarkers.values()).forEach(markers => allMarkers.push(...markers));
      expect(allMarkers.length).toEqual(0);
      expect(component.isCreateStreamsDisabled).toBeTruthy();
      done();
    }, 1000);
  });

  it('disable stream creation for invalid stream (space)', (done) => {
    fixture.detectChanges();
    expect(component.isCreateStreamsDisabled).toBeTruthy();
    component.dsl = ' ';
    fixture.detectChanges();
    // Validation is performed after a delay, hence the wait
    setTimeout(() => {
      expect(component.dsl).toEqual(' ');
      expect(component.parseErrors.length).toEqual(0);
      const allMarkers = [];
      Array.from(component.validationMarkers.values()).forEach(markers => allMarkers.push(...markers));
      expect(allMarkers.length).toEqual(0);
      expect(component.isCreateStreamsDisabled).toBeTruthy();
      done();
    }, 1000);
  });

  it('disable stream creation for graph validation error marker', (done) => {
    fixture.detectChanges();
    expect(component.isCreateStreamsDisabled).toBeTruthy();
    component.dsl = 'http';
    fixture.detectChanges();
    // Validation is performed after a delay, hence the wait
    // Should trigger source no connected to anything kind of validation error marker
    setTimeout(() => {
      expect(component.dsl).toEqual('http');
      expect(component.parseErrors.length).toEqual(0);
      const allMarkers = [];
      Array.from(component.validationMarkers.values()).forEach(markers => allMarkers.push(...markers));
      expect(allMarkers.length).toEqual(1);
      expect(component.isCreateStreamsDisabled).toBeTruthy();
      done();
    }, 1000);
  });

});
