import {async, ComponentFixture, TestBed} from '@angular/core/testing';


import {StreamDetailsComponent} from './stream-details.component';
import {MockStreamsService} from '../../tests/mocks/streams';
import {MockActivatedRoute} from '../../tests/mocks/activated-route';
import {RouterTestingModule} from '@angular/router/testing';
import {StreamsService} from '../streams.service';
import {ActivatedRoute} from '@angular/router';
import {GraphViewComponent} from '../../shared/flo/graph-view/graph-view.component';
import { FloModule } from 'spring-flo';
import {MockToastyService} from '../../tests/mocks/toasty';
import {ToastyService} from 'ng2-toasty';
import { MockMetamodelService } from '../flo/mocks/mock-metamodel.service';
import { MetamodelService } from '../flo/metamodel.service';
import { RenderService } from '../flo/render.service';



/**
 * Test {@link StreamDetailsComponent}.
 *
 * @author Glenn Renfro
 */
describe('StreamDetailsComponent', () => {
  let component: StreamDetailsComponent;
  let fixture: ComponentFixture<StreamDetailsComponent>;
  let activeRoute: MockActivatedRoute;
  const streamsService = new MockStreamsService();
  const commonTestParams = { id: '1' };
  const toastyService = new MockToastyService();
  const metamodelService = new MockMetamodelService();
  const renderService = new RenderService(metamodelService);

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [
        StreamDetailsComponent,
        GraphViewComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        FloModule
      ],
      providers: [
        {provide: StreamsService, useValue: streamsService},
        {provide: ActivatedRoute, useValue: activeRoute },
        {provide: ToastyService, useValue: toastyService},
        {provide: MetamodelService, useValue: metamodelService},
        {provide: RenderService, useValue: renderService}
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(StreamDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
