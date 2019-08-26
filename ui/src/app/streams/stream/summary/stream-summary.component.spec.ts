import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockStreamsService } from '../../../tests/mocks/streams';
import { MockActivatedRoute } from '../../../tests/mocks/activated-route';
import { RouterTestingModule } from '@angular/router/testing';
import { StreamsService } from '../../streams.service';
import { ActivatedRoute } from '@angular/router';
import { FloModule } from 'spring-flo';
import { MockNotificationService } from '../../../tests/mocks/notification';
import { StreamSummaryComponent } from './stream-summary.component';
import { BsModalService } from 'ngx-bootstrap';
import { MockModalService } from '../../../tests/mocks/modal';
import { StreamStatusComponent } from '../../components/stream-status/stream-status.component';
import { AppTypeComponent } from '../../../apps/components/app-type/app-type.component';
import { RolesDirective } from '../../../auth/directives/roles.directive';
import { StreamDslComponent } from '../../../shared/components/dsl/dsl.component';
import { STREAM_DEFINITIONS } from '../../../tests/mocks/mock-data';
import { MockAuthService } from '../../../tests/mocks/auth';
import { AuthService } from '../../../auth/auth.service';
import { MocksSharedAboutService } from '../../../tests/mocks/shared-about';
import { SharedAboutService } from '../../../shared/services/shared-about.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { DeploymentPropertiesInfoComponent } from '../../streams/deployment-properties-info/deployment-properties-info.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { LoggerService } from '../../../shared/services/logger.service';

/**
 * Test {@link StreamSummaryComponent}.
 *
 * @author Damien Vitrac
 */
describe('StreamSummaryComponent', () => {
  let component: StreamSummaryComponent;
  let fixture: ComponentFixture<StreamSummaryComponent>;
  let activeRoute: MockActivatedRoute;
  const streamsService = new MockStreamsService();
  const commonTestParams = { id: '1' };
  const notificationService = new MockNotificationService();
  const modalService = new MockModalService();
  const authService = new MockAuthService();
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [
        StreamSummaryComponent,
        StreamStatusComponent,
        AppTypeComponent,
        StreamDslComponent,
        RolesDirective,
        DeploymentPropertiesInfoComponent,
        LoaderComponent
      ],
      imports: [
        RouterTestingModule.withRoutes([]),
        FloModule
      ],
      providers: [
        { provide: StreamsService, useValue: streamsService },
        { provide: ActivatedRoute, useValue: activeRoute },
        { provide: BsModalService, useValue: modalService },
        { provide: AuthService, useValue: authService },
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(StreamSummaryComponent);
    component = fixture.componentInstance;
    streamsService.streamDefinitions = STREAM_DEFINITIONS;
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
