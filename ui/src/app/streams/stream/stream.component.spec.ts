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
import { StreamComponent } from './stream.component';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { MockRoutingStateService } from '../../tests/mocks/routing-state';
import { NotificationService } from '../../shared/services/notification.service';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { STREAM_DEFINITIONS } from '../../tests/mocks/mock-data';
import { MocksSharedAboutService } from '../../tests/mocks/shared-about';
import { SharedAboutService } from '../../shared/services/shared-about.service';
import { DATAFLOW_PAGE } from '../../shared/components/page/page.component';
import { DATAFLOW_LIST } from '../../shared/components/list/list.component';
import { PagerComponent } from 'src/app/shared/components/pager/pager.component';
import { BsDropdownModule, BsModalService, TooltipModule } from 'ngx-bootstrap';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';
import { StreamStatusComponent } from '../components/stream-status/stream-status.component';
import { RolesDirective } from '../../auth/directives/roles.directive';
import { LoggerService } from '../../shared/services/logger.service';
import { MockModalService } from '../../tests/mocks/modal';
import { MockAuthService } from '../../tests/mocks/auth';
import { AuthService } from '../../auth/auth.service';
import { GrafanaModule } from '../../shared/grafana/grafana.module';
import { GrafanaService } from '../../shared/grafana/grafana.service';
import { TippyDirective } from '../../shared/directives/tippy.directive';

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
  const routingStateService = new MockRoutingStateService();
  const aboutService = new MocksSharedAboutService();
  const loggerService = new LoggerService();
  const modalService = new MockModalService();
  const authService = new MockAuthService();

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [
        StreamComponent,
        GraphViewComponent,
        LoaderComponent,
        PagerComponent,
        DATAFLOW_PAGE,
        DATAFLOW_LIST,
        RolesDirective,
        StreamStatusComponent,
        TippyDirective
      ],
      imports: [
        FormsModule,
        NgxPaginationModule,
        GrafanaModule,
        BsDropdownModule.forRoot(),
        RouterTestingModule.withRoutes([]),
        TooltipModule.forRoot(),
        FloModule
      ],
      providers: [
        { provide: StreamsService, useValue: streamsService },
        { provide: SharedAboutService, useValue: aboutService },
        { provide: ActivatedRoute, useValue: activeRoute },
        { provide: AuthService, useValue: authService },
        { provide: BsModalService, useValue: modalService },
        { provide: RoutingStateService, useValue: routingStateService },
        { provide: NotificationService, useValue: notificationService },
        { provide: MetamodelService, useValue: metamodelService },
        { provide: LoggerService, useValue: loggerService },
        { provide: RenderService, useValue: renderService },
        GrafanaService
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
