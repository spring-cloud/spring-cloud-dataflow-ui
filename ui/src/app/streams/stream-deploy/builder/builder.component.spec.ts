import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockNotificationService } from '../../../tests/mocks/notification';
import { MockStreamsService } from '../../../tests/mocks/streams';
import { StreamsService } from '../../streams.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { MockActivatedRoute } from '../../../tests/mocks/activated-route';
import { ActivatedRoute } from '@angular/router';
import { MocksSharedAboutService } from '../../../tests/mocks/shared-about';
import { SharedAboutService } from '../../../shared/services/shared-about.service';
import { BsDropdownModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { AppTypeComponent } from '../../../apps/components/app-type/app-type.component';
import { NotificationService } from '../../../shared/services/notification.service';
import { LoggerService } from '../../../shared/services/logger.service';
import { DATAFLOW_PAGE } from 'src/app/shared/components/page/page.component';
import { PagerComponent } from '../../../shared/components/pager/pager.component';
import { DATAFLOW_LIST } from '../../../shared/components/list/list.component';
import { APPS_2, STREAM_DEFINITIONS } from '../../../tests/mocks/mock-data';
import { RoutingStateService } from '../../../shared/services/routing-state.service';
import { MockRoutingStateService } from '../../../tests/mocks/routing-state';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { StreamDeployFreeTextComponent } from '../free-text/free-text.component';
import { StreamDeployBuilderComponent } from '../builder/builder.component';
import { NgxPaginationModule } from 'ngx-pagination/dist/ngx-pagination';
import { StreamDeployBuilderErrorsComponent } from '../builder/errors/errors.component';
import { FocusDirective } from '../../../shared/directives/focus.directive';
import { StreamDeployService } from 'src/app/streams/stream-deploy/stream-deploy.service';
import { MockSharedAppService } from 'src/app/tests/mocks/shared-app';
import { MockAppsService } from '../../../tests/mocks/apps';
import { ClipboardModule, ClipboardService } from 'ngx-clipboard';
import { BlockerService } from '../../../shared/components/blocker/blocker.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TippyDirective } from '../../../shared/directives/tippy.directive';

/**
 * Test {@link StreamDeployBuilderComponent}.
 *
 * @author Janne Valkealahti
 */
xdescribe('StreamDeployBuilderComponent', () => {
  let component: StreamDeployBuilderComponent;
  let fixture: ComponentFixture<StreamDeployBuilderComponent>;
  const notificationService = new MockNotificationService();
  const streamsService = new MockStreamsService();
  const sharedAboutService = new MocksSharedAboutService();
  const appsService = new MockAppsService();
  const sharedAppService = new MockSharedAppService();
  let activeRoute: MockActivatedRoute;
  const loggerService = new LoggerService();
  const routingStateService = new MockRoutingStateService();
  const streamDeployService = new StreamDeployService(streamsService as any, sharedAppService, appsService as any);

  beforeEach(async(() => {
    activeRoute = new MockActivatedRoute();

    TestBed.configureTestingModule({
      declarations: [
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
        RouterTestingModule.withRoutes([])
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
    streamsService.streamDefinitions = STREAM_DEFINITIONS;
    fixture = TestBed.createComponent(StreamDeployBuilderComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Get properties', () => {

    it('deployment should have correct values', () => {
      const builderDeploymentProperties  = {
        global: [
          {id: 'mock.my-string', defaultValue: 'foo', value: 'bar'},
          {id: 'mock.my-boolean', defaultValue: true, value: false}
        ],
        apps: {}
      };
      const ret = component.getDeploymentProperties(builderDeploymentProperties);
      expect(ret.length).toBe(2);
      expect(ret[0].key).toBe('mock.my-string');
      expect(ret[0].value).toBe('bar');
      expect(ret[1].key).toBe('mock.my-boolean');
      expect(ret[1].value).toBe(false);
    });

    it('apps should have correct values', () => {
      const builderAppsProperties  = {
        fake: [
          {id: 'mock.my-string', defaultValue: 'foo', value: 'bar'},
          {id: 'mock.my-boolean', defaultValue: true, value: false}
        ]
      };
      const ret = component.getAppProperties(builderAppsProperties, 'fake');
      expect(ret.length).toBe(2);
      expect(ret[0].key).toBe('mock.my-string');
      expect(ret[0].value).toBe('bar');
      expect(ret[1].key).toBe('mock.my-boolean');
      expect(ret[1].value).toBe(false);
    });
  });

  describe('Form values', () => {

    beforeEach(() => {
      appsService.mock = Object.assign({}, JSON.parse(JSON.stringify(APPS_2)));
      component.id = 'foo2';
      fixture.detectChanges();
    });

    it('platform select changes to modal controls', () => {
      const s: DebugElement[] = fixture.debugElement.queryAll(By.css('select'));
      expect(s.length).toBe(3);
      const platform = s[0].nativeElement;
      platform.value = platform.options[1].value;
      platform.dispatchEvent(new Event('change'));
      fixture.detectChanges();
      expect(platform.value).toContain('default');
      // we don't show 'No properties' but have '0 / 1 properties'
      const tr: DebugElement[] = fixture.debugElement.queryAll(By.css('.form-control > strong'));
      expect(tr.length).toBe(3);
      expect(tr[0].nativeElement.textContent).toContain('0');
      expect(tr[1].nativeElement.textContent).toContain('0');
      expect(tr[2].nativeElement.textContent).toContain('0');
    });

  });

});
