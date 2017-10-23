import {StreamCreateComponent} from './stream-create.component';
import {BusyModule} from 'tixif-ngx-busy';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {MockActivatedRoute} from '../../tests/mocks/activated-route';
import {MockStreamsService} from '../../tests/mocks/streams';
import {MockMetamodelService} from '../flo/mocks/mock-metamodel.service';
import {RouterTestingModule} from '@angular/router/testing';
import {StreamsService} from '../streams.service';
import {MetamodelService} from '../flo/metamodel.service';
import {EditorService} from '../flo/editor.service';
import {RenderService} from '../flo/render.service';
import {ActivatedRoute} from '@angular/router';
import { FloModule} from 'spring-flo';
import {ModalModule, BsModalService} from 'ngx-bootstrap';
import { ContentAssistService } from '../flo/content-assist.service';
import { ParserService } from '../../shared/services/parser.service';

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
  const metamodelService = new MockMetamodelService();
  const renderService = new RenderService(metamodelService);
  const parserService = new ParserService();
  const editorService = new EditorService(null);

  const commonTestParams = { id: '1' };

  beforeEach(async () => {
    activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [
        StreamCreateComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        ModalModule,
        FloModule,
        BusyModule,
        NoopAnimationsModule
      ],
      providers: [
        {provide: StreamsService, useValue: streamsService},
        {provide: MetamodelService, useValue: metamodelService},
        {provide: RenderService, useValue: renderService},
        {provide: ContentAssistService},
        {provide: BsModalService},
        {provide: ActivatedRoute, useValue: activeRoute},
        {provide: ParserService, useValue: parserService},
        {provide: EditorService, useValue: editorService}
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

  it('disable stream creation for empty streams', () => {
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
