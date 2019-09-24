import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockNotificationService } from '../../../tests/mocks/notification';
import { MockAuthService } from '../../../tests/mocks/auth';
import { BsModalRef, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { MockStreamsService } from '../../../tests/mocks/streams';
import { LoggerService } from '../../../shared/services/logger.service';
import { StreamsExportComponent } from './streams-export.component';
import { StreamDslComponent } from '../../../shared/components/dsl/dsl.component';
import { TruncatePipe } from '../../../shared/pipes/truncate.pipe';
import { RolesDirective } from '../../../auth/directives/roles.directive';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../../auth/auth.service';
import { NotificationService } from '../../../shared/services/notification.service';
import { StreamsService } from '../../streams.service';
import { BlockerService } from '../../../shared/components/blocker/blocker.service';
import { StreamsUtilsService } from '../streams-utils.service';
import { LoaderComponent } from '../../../shared/components/loader/loader.component';
import { MasterCheckboxComponent } from '../../../shared/components/master-checkbox.component';
import { DATAFLOW_PAGE } from '../../../shared/components/page/page.component';
import { MockRoutingStateService } from '../../../tests/mocks/routing-state';
import { RoutingStateService } from '../../../shared/services/routing-state.service';
import { By } from '@angular/platform-browser';
import { MockStreamsUtilsService } from '../../../tests/mocks/streams-utils';

describe('StreamsExportComponent', () => {

  let component: StreamsExportComponent;
  let fixture: ComponentFixture<StreamsExportComponent>;
  const notificationService = new MockNotificationService();
  const authService = new MockAuthService();
  const bsModalRef = new BsModalRef();
  const streamsService = new MockStreamsService();
  const loggerService = new LoggerService();
  const routingStateService = new MockRoutingStateService();
  const streamsUtilsService = new MockStreamsUtilsService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        StreamsExportComponent,
        StreamDslComponent,
        LoaderComponent,
        TruncatePipe,
        MasterCheckboxComponent,
        DATAFLOW_PAGE,
        RolesDirective
      ],
      imports: [
        FormsModule,
        ModalModule.forRoot(),
        TooltipModule.forRoot(),
        ReactiveFormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: BsModalRef, useValue: bsModalRef },
        { provide: NotificationService, useValue: notificationService },
        { provide: RoutingStateService, useValue: routingStateService },
        { provide: StreamsService, useValue: streamsService },
        { provide: LoggerService, useValue: loggerService },
        { provide: StreamsUtilsService, useValue: streamsUtilsService },
        BlockerService
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamsExportComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('no stream', () => {

    beforeEach(() => {
      streamsService.streamDefinitions = {
        _embedded: {
          streamDefinitionResourceList: []
        },
        page: {
          size: 20,
          totalElements: 0,
          totalPages: 0
        }
      };
      fixture.detectChanges();
    });

    it('should display a specific message', () => {
      const message = fixture.debugElement.query(By.css('#empty'));
      const streamsExport = fixture.debugElement.query(By.css('#streams-export'));
      fixture.detectChanges();
      expect(message).toBeTruthy();
      expect(streamsExport).toBeFalsy();
    });

  });

  describe('with streams', () => {

    beforeEach(() => {
      streamsService.streamDefinitions = {
        _embedded: {
          streamDefinitionResourceList: Array.from({ length: 10 }).map((a, i) => {
            return {
              name: `foo${i}`,
              dslText: 'time | log ',
              originalDslText: 'time | log',
              description: 'demo-stream',
              status: 'undeployed',
              statusDescription: 'The app or group is known to the system, but is not currently deployed',
              force: false,
            };
          })
        },
        page: {
          size: 20,
          totalElements: 10,
          totalPages: 1
        }
      };
      fixture.detectChanges();
    });

    it('should display the export box, 10 streams', () => {
      const message = fixture.debugElement.query(By.css('#empty'));
      const streamsExport = fixture.debugElement.query(By.css('#streams-export'));
      const lines = fixture.debugElement.queryAll(By.css('#streams-export table tbody tr'));
      fixture.detectChanges();
      expect(streamsExport).toBeTruthy();
      expect(lines.length).toBe(10);
      expect(message).toBeFalsy();
    });

    it('should call the right service', () => {
      const spy = spyOn(streamsUtilsService, 'createFile').and.callThrough();
      fixture.debugElement.query(By.css('#btn-export')).nativeElement.click();
      expect(spy).toHaveBeenCalled();
    });

  });

});
