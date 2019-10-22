import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MockNotificationService } from '../../../tests/mocks/notification';
import { MockAuthService } from '../../../tests/mocks/auth';
import { BsModalRef, ModalModule, TooltipModule } from 'ngx-bootstrap';
import { MockStreamsService } from '../../../tests/mocks/streams';
import { LoggerService } from '../../../shared/services/logger.service';
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
import { StreamsImportComponent } from './streams-import.component';
import { MockStreamsUtilsService } from '../../../tests/mocks/streams-utils';
import { By } from '@angular/platform-browser';

describe('StreamsImportComponent', () => {

  let component: StreamsImportComponent;
  let fixture: ComponentFixture<StreamsImportComponent>;
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
        StreamsImportComponent,
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
        BlockerService,
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StreamsImportComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Invalid file', () => {

    it('should display an error', () => {
      fixture.detectChanges();
      const spy = spyOn(notificationService, 'error');
      fixture.debugElement.query(By.css('#btn-import')).nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalledWith('Please, select a file.');
    });


  });

  describe('Valid file', () => {

    it('should call the right service', () => {
      component.file = {
        name: 'sample',
      };
      fixture.detectChanges();
      const spy = spyOn(streamsUtilsService, 'importStreams');
      fixture.debugElement.query(By.css('#btn-import')).nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

    it('should display the result', () => {
      component.file = {
        name: 'sample',
      };
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('#import-file'))).toBeTruthy();
      expect(fixture.debugElement.query(By.css('#import-result'))).toBeFalsy();

      fixture.debugElement.query(By.css('#btn-import')).nativeElement.click();
      fixture.detectChanges();

      expect(fixture.debugElement.query(By.css('#import-file'))).toBeFalsy();
      expect(fixture.debugElement.query(By.css('#import-result'))).toBeTruthy();
    });

  });


});
