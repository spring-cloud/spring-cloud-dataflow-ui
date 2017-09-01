import {StreamCreateComponent} from './stream-create.component';
import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MockActivatedRoute} from '../../tests/mocks/activated-route';
import {MockStreamsService} from '../../tests/mocks/streams';
import {MockMetamodelService} from '../flo/mocks/mock.metamodel.service';
import {RouterTestingModule} from '@angular/router/testing';
import {StreamsService} from '../streams.service';
import {MetamodelService} from '../flo/metamodel.service';
import {EditorService} from '../flo/editor.service';
import {RenderService} from '../flo/render.service';
import {ActivatedRoute} from '@angular/router';
import { FloModule} from 'spring-flo';
import {ModalModule, BsModalService} from "ngx-bootstrap";
import { ContentAssistService } from '../flo/content.assist.service';

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
  // const editorService = new EditorService(null);
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
        FloModule
      ],
      providers: [
        {provide: StreamsService, useValue: streamsService},
        {provide: MetamodelService, useValue: metamodelService},
        {provide: RenderService, useValue: renderService},
        {provide: EditorService},
        {provide: ContentAssistService},
        {provide: BsModalService},
        {provide: ActivatedRoute, useValue: activeRoute },
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
});
