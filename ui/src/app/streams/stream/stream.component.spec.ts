import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStreamsService } from '../../tests/mocks/streams';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { RouterTestingModule } from '@angular/router/testing';
import { StreamsService } from '../streams.service';
import { ActivatedRoute } from '@angular/router';
import { GraphViewComponent } from '../../shared/flo/graph-view/graph-view.component';
import { FloModule } from 'spring-flo';
import { MockNotificationService } from '../../tests/mocks/notification';
import { MetamodelService } from '../components/flo/metamodel.service';
import { RenderService } from '../components/flo/render.service';
import { MockSharedAppService } from '../../tests/mocks/shared-app';
import { BusyService } from '../../shared/services/busy.service';
import { StreamComponent } from './stream.component';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { MockRoutingStateService } from '../../tests/mocks/routing-state';
import { NotificationService } from '../../shared/services/notification.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { STREAM_DEFINITIONS } from '../../tests/mocks/mock-data';
import { MocksSharedAboutService } from '../../tests/mocks/shared-about';
import { SharedAboutService } from '../../shared/services/shared-about.service';


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
  const commonTestParams = { id: '1' };
  const notificationService = new MockNotificationService();
  const metamodelService = new MetamodelService(new MockSharedAppService());
  const renderService = new RenderService(metamodelService);
  const busyService = new BusyService();
  const routingStateService = new MockRoutingStateService();
  const aboutService = new MocksSharedAboutService();

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [
        StreamComponent,
        GraphViewComponent,
        LoaderComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        FloModule
      ],
      providers: [
        { provide: StreamsService, useValue: streamsService },
        { provide: SharedAboutService, useValue: aboutService },
        { provide: ActivatedRoute, useValue: activeRoute },
        { provide: BusyService, useValue: busyService },
        { provide: RoutingStateService, useValue: routingStateService },
        { provide: NotificationService, useValue: notificationService },
        { provide: MetamodelService, useValue: metamodelService },
        { provide: RenderService, useValue: renderService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(StreamComponent);
    component = fixture.componentInstance;
    streamsService.streamDefinitions = STREAM_DEFINITIONS;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
