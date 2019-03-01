import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStreamsService } from '../../../tests/mocks/streams';
import { MockActivatedRoute } from '../../../tests/mocks/activated-route';
import { RouterTestingModule } from '@angular/router/testing';
import { StreamsService } from '../../streams.service';
import { ActivatedRoute } from '@angular/router';
import { GraphViewComponent } from '../../../shared/flo/graph-view/graph-view.component';
import { FloModule } from 'spring-flo';
import { MockNotificationService } from '../../../tests/mocks/notification';
import { MetamodelService } from '../../components/flo/metamodel.service';
import { RenderService } from '../../components/flo/render.service';
import { MockSharedAppService } from '../../../tests/mocks/shared-app';
import { StreamGraphComponent } from './stream-graph.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { NotificationService } from '../../../shared/services/notification.service';


/**
 * Test {@link StreamGraphComponent}.
 *
 * @author Glenn Renfro
 * @author Damien Vitrac
 */
describe('StreamGraphComponent', () => {
  let component: StreamGraphComponent;
  let fixture: ComponentFixture<StreamGraphComponent>;
  let activeRoute: MockActivatedRoute;
  const streamsService = new MockStreamsService();
  const commonTestParams = { id: '1' };
  const notificationService = new MockNotificationService();
  const metamodelService = new MetamodelService(new MockSharedAppService());
  const renderService = new RenderService(metamodelService);

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [
        StreamGraphComponent,
        GraphViewComponent,
        LoaderComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        FloModule
      ],
      providers: [
        { provide: StreamsService, useValue: streamsService },
        { provide: ActivatedRoute, useValue: activeRoute },
        { provide: NotificationService, useValue: notificationService },
        { provide: MetamodelService, useValue: metamodelService },
        { provide: RenderService, useValue: renderService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(StreamGraphComponent);
    component = fixture.componentInstance;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
