import { StreamCreateComponent } from './stream-create.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { MockStreamsService } from '../../tests/mocks/streams';
import { RouterTestingModule } from '@angular/router/testing';
import { StreamsService } from '../streams.service';
import { MetamodelService } from '../components/flo/metamodel.service';
import { EditorService } from '../components/flo/editor.service';
import { RenderService } from '../components/flo/render.service';
import { ActivatedRoute } from '@angular/router';
import { FloModule } from 'spring-flo';
import { ModalModule, BsModalService, BsDropdownModule, TooltipModule } from 'ngx-bootstrap';
import { ContentAssistService } from '../components/flo/content-assist.service';
import { ParserService } from '../../shared/services/parser.service';
import { MockSharedAppService } from '../../tests/mocks/shared-app';
import { LoggerService } from '../../shared/services/logger.service';
import { DATAFLOW_PAGE } from '../../shared/components/page/page.component';
import { StreamStatusComponent } from 'src/app/streams/components/stream-status/stream-status.component';
import { DATAFLOW_LIST } from 'src/app/shared/components/list/list.component';
import { FormsModule } from '@angular/forms';
import { NgxPaginationModule } from 'ngx-pagination';
import { PagerComponent } from '../../shared/components/pager/pager.component';
import { MockRoutingStateService } from 'src/app/tests/mocks/routing-state';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { MockNotificationService } from '../../tests/mocks/notification';
import { NotificationService } from '../../shared/services/notification.service';

/**
 * Test {@link StreamCreateComponent}.
 *
 * @author Glenn Renfro
 */
describe('StreamCreateComponent', () => {
  let component: StreamCreateComponent;
  let fixture: ComponentFixture<StreamCreateComponent>;
  let activeRoute: MockActivatedRoute;
  const streamsService = new MockStreamsService();
  const metamodelService = new MetamodelService(new MockSharedAppService());
  const renderService = new RenderService(metamodelService);
  const parserService = new ParserService();
  const editorService = new EditorService(null);
  const loggerService = new LoggerService();
  const routingStateService = new MockRoutingStateService();
  const notificationService = new MockNotificationService();

  const commonTestParams = { id: '1' };

  beforeEach(async () => {
    activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [
        StreamCreateComponent,
        DATAFLOW_PAGE,
        DATAFLOW_LIST,
        PagerComponent,
        StreamStatusComponent
      ],
      imports: [
        FormsModule,
        NgxPaginationModule,
        BsDropdownModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        ModalModule,
        FloModule,
        TooltipModule.forRoot(),
        NoopAnimationsModule
      ],
      providers: [
        { provide: StreamsService, useValue: streamsService },
        { provide: MetamodelService, useValue: metamodelService },
        { provide: RoutingStateService, useValue: routingStateService },
        { provide: NotificationService, useValue: notificationService },
        { provide: RenderService, useValue: renderService },
        { provide: ContentAssistService },
        { provide: BsModalService },
        { provide: ActivatedRoute, useValue: activeRoute },
        { provide: ParserService, useValue: parserService },
        { provide: EditorService, useValue: editorService },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  });

  beforeEach(() => {
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(StreamCreateComponent);
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
