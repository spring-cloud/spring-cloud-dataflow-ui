import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockNotificationService } from '../../tests/mocks/notification';
import { MockStreamsService } from '../../tests/mocks/streams';
import { StreamsService } from '../streams.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockActivatedRoute } from '../../tests/mocks/activated-route';
import { ActivatedRoute } from '@angular/router';
import { StreamDeployComponent } from './stream-deploy.component';
import { MockComponent } from '../../tests/mocks/mock-component';
import { MocksSharedAboutService } from '../../tests/mocks/shared-about';
import { SharedAboutService } from '../../shared/services/shared-about.service';
import { BsDropdownModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { AppTypeComponent } from '../../apps/components/app-type/app-type.component';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { DATAFLOW_PAGE } from 'src/app/shared/components/page/page.component';
import { PagerComponent } from '../../shared/components/pager/pager.component';
import { DATAFLOW_LIST } from '../../shared/components/list/list.component';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { MockRoutingStateService } from '../../tests/mocks/routing-state';
import { LoaderComponent } from '../../shared/components/loader/loader.component';
import { StreamDeployFreeTextComponent } from './free-text/free-text.component';
import { StreamDeployBuilderComponent } from './builder/builder.component';
import { NgxPaginationModule } from 'ngx-pagination/dist/ngx-pagination';
import { StreamDeployBuilderErrorsComponent } from './builder/errors/errors.component';
import { FocusDirective } from '../../shared/directives/focus.directive';
import { StreamDeployService } from 'src/app/streams/stream-deploy/stream-deploy.service';
import { MockSharedAppService } from 'src/app/tests/mocks/shared-app';
import { MockAppsService } from '../../tests/mocks/apps';
import { ClipboardModule, ClipboardService } from 'ngx-clipboard';
import { BlockerService } from '../../shared/components/blocker/blocker.service';
import { TippyDirective } from '../../shared/directives/tippy.directive';

/**
 * Test {@link StreamDeployComponent}.
 *
 * @author Glenn Renfro
 */
describe('StreamDeployComponent', () => {
  let component: StreamDeployComponent;
  let fixture: ComponentFixture<StreamDeployComponent>;
  const notificationService = new MockNotificationService();
  const streamsService = new MockStreamsService();
  const sharedAboutService = new MocksSharedAboutService();
  const appsService = new MockAppsService();
  const sharedAppService = new MockSharedAppService();
  let activeRoute: MockActivatedRoute;
  const commonTestParams = { id: '1' };
  const loggerService = new LoggerService();
  const routingStateService = new MockRoutingStateService();
  const streamDeployService = new StreamDeployService(streamsService as any, sharedAppService, appsService as any);

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [
        StreamDeployComponent,
        PagerComponent,
        DATAFLOW_PAGE,
        DATAFLOW_LIST,
        LoaderComponent,
        AppTypeComponent,
        StreamDeployFreeTextComponent,
        StreamDeployBuilderComponent,
        StreamDeployBuilderErrorsComponent,
        FocusDirective,
        TippyDirective
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        TooltipModule.forRoot(),
        ModalModule.forRoot(),
        BsDropdownModule.forRoot(),
        NgxPaginationModule,
        ClipboardModule,
        RouterTestingModule.withRoutes([{ path: 'streams/definitions', component: MockComponent }])
      ],
      providers: [
        { provide: StreamsService, useValue: streamsService },
        { provide: ActivatedRoute, useValue: activeRoute },
        { provide: SharedAboutService, useValue: sharedAboutService },
        { provide: NotificationService, useValue: notificationService },
        { provide: RoutingStateService, useValue: routingStateService },
        { provide: StreamDeployService, useValue: streamDeployService },
        { provide: LoggerService, useValue: loggerService },
        ClipboardService,
        BlockerService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    activeRoute.testParams = commonTestParams;
    fixture = TestBed.createComponent(StreamDeployComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Run Copy', () => {

    it('should copy and display a success message', () => {
      component.runCopy(['a=a', 'b=b']);
      fixture.detectChanges();
      expect(notificationService.testSuccess[0]).toContain('The properties have been copied to your clipboard.');
    });

    it('should display an error message (empty)', () => {
      component.runCopy([]);
      fixture.detectChanges();
      expect(notificationService.testError[0]).toContain('There are no properties to copy.');
    });

  });

  describe('Run Export', () => {

    it('should display an error message (empty)', () => {
      component.runExport([]);
      fixture.detectChanges();
      expect(notificationService.testError[0]).toContain('There are no properties to export.');
    });

  });

});
