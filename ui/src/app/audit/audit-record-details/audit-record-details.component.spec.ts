import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BsDropdownModule, BsModalService, ModalModule, PopoverModule, TooltipModule } from 'ngx-bootstrap';
import { AuditRecordService } from '../audit-record.service';
import { MockNotificationService } from '../../tests/mocks/notification';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { AuditRecordDetailsComponent } from './audit-record-details.component';
import { RolesDirective } from '../../auth/directives/roles.directive';
import { ActivatedRoute, Params } from '@angular/router';
import { MockAuthService } from '../../tests/mocks/auth';
import { AuthService } from '../../auth/auth.service';
import { SortComponent } from '../../shared/components/sort/sort.component';
import { OrderByPipe } from '../../shared/pipes/orderby.pipe';
import { RoutingStateService } from '../../shared/services/routing-state.service';
import { MockRoutingStateService } from '../../tests/mocks/routing-state';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { DATAFLOW_PAGE } from 'src/app/shared/components/page/page.component';
import { DATAFLOW_LIST } from 'src/app/shared/components/list/list.component';
import { PagerComponent } from '../../shared/components/pager/pager.component';
import { NgxPaginationModule } from 'ngx-pagination/dist/ngx-pagination';
import { MockAuditRecordService } from '../../tests/mocks/audit';
import { Observable, of } from 'rxjs';
import { AuditRecordActionComponent } from '../components/audit-record-action/audit-record-action.component';
import { AuditRecordOperationComponent } from '../components/audit-record-operation/audit-record-operation.component';
import { DataflowDateTimePipe } from '../../shared/pipes/dataflow-date-time.pipe';

/**
 * Test {@link AuditRecordDetailsComponent}.
 *
 * @author Gunnar Hillert
 */
describe('AuditRecordDetailsComponent', () => {
  let component: AuditRecordDetailsComponent;
  let fixture: ComponentFixture<AuditRecordDetailsComponent>;
  const notificationService = new MockNotificationService();
  const auditRecordService = new MockAuditRecordService();
  const authService = new MockAuthService();

  const routingStateService = new MockRoutingStateService();
  const loggerService = new LoggerService();

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AuditRecordDetailsComponent,
        SortComponent,
        OrderByPipe,
        RolesDirective,
        DATAFLOW_PAGE,
        DATAFLOW_LIST,
        PagerComponent,
        AuditRecordActionComponent,
        AuditRecordOperationComponent,
        DataflowDateTimePipe
      ],
      imports: [
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        TooltipModule.forRoot(),
        BsDropdownModule.forRoot(),
        NgxPaginationModule,
        ReactiveFormsModule,
        FormsModule,
        RouterTestingModule.withRoutes([])
      ],
      providers: [
        { provide: AuditRecordService, useValue: auditRecordService },
        { provide: AuthService, useValue: authService },
        { provide: ActivatedRoute, useValue: {
          params: of({ auditRecordId: 12347 })
        } },
        BsModalService,
        { provide: RoutingStateService, useValue: routingStateService },
        { provide: NotificationService, useValue: notificationService },
        { provide: LoggerService, useValue: loggerService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AuditRecordDetailsComponent);
    component = fixture.componentInstance;
    notificationService.clearAll();
  });

  it('should be created', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });
});
