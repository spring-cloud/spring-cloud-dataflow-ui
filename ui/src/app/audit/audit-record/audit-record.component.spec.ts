import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { AuditRecordComponent } from './audit-record.component';
import { MockNotificationService } from '../../tests/mocks/notification';
import { BsDropdownModule, BsModalService, ModalModule, PopoverModule, TooltipModule, BsModalRef } from 'ngx-bootstrap';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { SharedAboutService } from '../../shared/services/shared-about.service';
import { MocksSharedAboutService } from '../../tests/mocks/shared-about';
import { MockAuthService } from '../../tests/mocks/auth';
import { AuthService } from '../../auth/auth.service';
import { RolesDirective } from '../../auth/directives/roles.directive';
import { SortComponent } from '../../shared/components/sort/sort.component';
import { MasterCheckboxComponent } from '../../shared/components/master-checkbox.component';
import { TruncatePipe } from '../../shared/pipes/truncate.pipe';
import { NgxPaginationModule } from 'ngx-pagination';
import { BusyService } from '../../shared/services/busy.service';
import { TruncatorComponent } from '../../shared/components/truncator/truncator.component';
import { TruncatorWidthProviderDirective } from '../../shared/components/truncator/truncator-width-provider.directive';
import { PagerComponent } from '../../shared/components/pager/pager.component';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { DATAFLOW_PAGE } from '../../shared/components/page/page.component';
import { DATAFLOW_LIST } from '../../shared/components/list/list.component';
import { AuditRecordService } from '../audit-record.service';
import { MockAuditRecordService } from '../../tests/mocks/audit';
import { AuditRecordListBarComponent } from '../components/audit-record-list-bar/audit-record-list-bar.component';
import { AuditRecordActionComponent } from '../components/audit-record-action/audit-record-action.component';
import { AuditRecordOperationComponent } from '../components/audit-record-operation/audit-record-operation.component';
import { DataflowDateTimePipe } from 'src/app/shared/pipes/dataflow-date-time.pipe';

describe('AuditRecordComponent', () => {

  let component: AuditRecordComponent;
  let fixture: ComponentFixture<AuditRecordComponent>;
  const notificationService = new MockNotificationService();
  const auditRecordService = new MockAuditRecordService();
  const sharedAboutService = new MocksSharedAboutService();
  const authService = new MockAuthService();
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AuditRecordComponent,
        SortComponent,
        TruncatePipe,
        TruncatorComponent,
        TruncatorWidthProviderDirective,
        MasterCheckboxComponent,
        PagerComponent,
        DATAFLOW_PAGE,
        DATAFLOW_LIST,
        RolesDirective,
        AuditRecordListBarComponent,
        AuditRecordActionComponent,
        AuditRecordOperationComponent,
        DataflowDateTimePipe
      ],
      imports: [
        FormsModule,
        NgxPaginationModule,
        RouterTestingModule.withRoutes([]),
        TooltipModule.forRoot(),
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot()
      ],
      providers: [
        BsModalService,
        { provide: AuditRecordService, useValue: auditRecordService },
        { provide: AuthService, useValue: authService },
        BsModalService,
        { provide: BusyService, useValue: new BusyService() },
        { provide: SharedAboutService, useValue: sharedAboutService },
        { provide: LoggerService, useValue: loggerService },
        { provide: NotificationService, useValue: notificationService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditRecordComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

});
