import {async, ComponentFixture, TestBed} from '@angular/core/testing';
import {MockStreamsService} from '../../tests/mocks/streams';
import {MockActivatedRoute} from '../../tests/mocks/activated-route';
import {RouterTestingModule} from '@angular/router/testing';
import {StreamsService} from '../streams.service';
import {ActivatedRoute} from '@angular/router';
import {GraphViewComponent} from '../../shared/flo/graph-view/graph-view.component';
import {FloModule} from 'spring-flo';
import {MockToastyService} from '../../tests/mocks/toasty';
import {ToastyService} from 'ng2-toasty';
import {MetamodelService} from '../components/flo/metamodel.service';
import {RenderService} from '../components/flo/render.service';
import {MockSharedAppService} from '../../tests/mocks/shared-app';
import {BusyService} from '../../shared/services/busy.service';
import {StreamComponent} from './stream.component';


/**
 * Test {@link StreamComponent}.
 *
 * @author Glenn Renfro
 */
describe('StreamComponent', () => {
  let component: StreamComponent;
  let fixture: ComponentFixture<StreamComponent>;
  let activeRoute: MockActivatedRoute;
  const streamsService = new MockStreamsService();
  const commonTestParams = {id: '1'};
  const toastyService = new MockToastyService();
  const metamodelService = new MetamodelService(new MockSharedAppService());
  const renderService = new RenderService(metamodelService);

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [
        StreamComponent,
        GraphViewComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        FloModule
      ],
      providers: [
        {provide: StreamsService, useValue: streamsService},
        {provide: ActivatedRoute, useValue: activeRoute},
        {provide: BusyService, useValue: new BusyService()},
        {provide: ToastyService, useValue: toastyService},
        {provide: MetamodelService, useValue: metamodelService},
        {provide: RenderService, useValue: renderService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(StreamComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
