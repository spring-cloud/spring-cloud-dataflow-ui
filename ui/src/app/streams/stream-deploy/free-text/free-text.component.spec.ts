import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { DATAFLOW_PAGE } from 'src/app/shared/components/page/page.component';
import { NgxPaginationModule } from 'ngx-pagination/dist/ngx-pagination';
import { StreamDeployService } from 'src/app/streams/stream-deploy/stream-deploy.service';
import { MockSharedAppService } from 'src/app/tests/mocks/shared-app';
import { StreamDeployFreeTextComponent } from './free-text.component';
import { MockNotificationService } from '../../../tests/mocks/notification';
import { MockStreamsService } from '../../../tests/mocks/streams';
import { MocksSharedAboutService } from '../../../tests/mocks/shared-about';
import { MockAppsService } from 'src/app/tests/mocks/apps';
import { StreamsService } from '../../streams.service';
import { SharedAboutService } from '../../../shared/services/shared-about.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { LoggerService } from '../../../shared/services/logger.service';
import { PagerComponent } from '../../../shared/components/pager/pager.component';
import { DATAFLOW_LIST } from '../../../shared/components/list/list.component';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { AppTypeComponent } from '../../../apps/components/app-type/app-type.component';
import { FocusDirective } from '../../../shared/directives/focus.directive';
import { TippyDirective } from '../../../shared/directives/tippy.directive';

/**
 * Test {@link StreamDeployComponent}.
 *
 * @author Glenn Renfro
 */
describe('StreamDeployFreeTextComponent', () => {
  let component: StreamDeployFreeTextComponent;
  let fixture: ComponentFixture<StreamDeployFreeTextComponent>;
  const notificationService = new MockNotificationService();
  const streamsService = new MockStreamsService();
  const sharedAboutService = new MocksSharedAboutService();
  const appsService = new MockAppsService();
  const sharedAppService = new MockSharedAppService();
  const loggerService = new LoggerService();
  const streamDeployService = new StreamDeployService(streamsService as any, sharedAppService, appsService as any);

  beforeEach(async(() => {

    TestBed.configureTestingModule({
      declarations: [
        StreamDeployFreeTextComponent,
        PagerComponent,
        DATAFLOW_PAGE,
        DATAFLOW_LIST,
        LoaderComponent,
        AppTypeComponent,
        FocusDirective,
        TippyDirective
      ],
      imports: [
        FormsModule,
        ReactiveFormsModule,
        TooltipModule.forRoot(),
        ModalModule.forRoot(),
        BsDropdownModule.forRoot(),
        NgxPaginationModule
      ],
      providers: [
        { provide: StreamsService, useValue: streamsService },
        { provide: SharedAboutService, useValue: sharedAboutService },
        { provide: NotificationService, useValue: notificationService },
        { provide: StreamDeployService, useValue: streamDeployService },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamDeployFreeTextComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should load a file in the properties input', (done) => {
    fixture.detectChanges();
    const event = { target: { files: [new Blob(['a=a'])] } };
    component.fileChange(event);
    setTimeout(() => {
      fixture.detectChanges();
      expect(component.formGroup.get('input').value).toContain('a=a');
      done();
    }, 1000);
  });

});
