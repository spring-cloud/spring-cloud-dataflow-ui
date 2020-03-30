import { async, ComponentFixture, fakeAsync, TestBed } from '@angular/core/testing';
import { AuditRecordComponent } from './audit-record.component';
import { MockNotificationService } from '../../tests/mocks/notification';
import {
  BsDropdownModule,
  BsModalService,
  ModalModule,
  PopoverModule,
  TooltipModule,
  BsModalRef,
  BsDatepickerModule
} from 'ngx-bootstrap';
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
import { AUDIT_RECORDS } from '../../tests/mocks/mock-data';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { TippyDirective } from '../../shared/directives/tippy.directive';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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
        DataflowDateTimePipe,
        TippyDirective
      ],
      imports: [
        FormsModule,
        NgxPaginationModule,
        BrowserAnimationsModule,
        RouterTestingModule.withRoutes([]),
        TooltipModule.forRoot(),
        ModalModule.forRoot(),
        PopoverModule.forRoot(),
        BsDropdownModule.forRoot(),
        BsDatepickerModule.forRoot()
      ],
      providers: [
        BsModalService,
        { provide: AuditRecordService, useValue: auditRecordService },
        { provide: AuthService, useValue: authService },
        BsModalService,
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

  describe('1 page', () => {

    beforeEach(() => {
      auditRecordService.auditRecords = AUDIT_RECORDS;
      fixture.detectChanges();
    });

    it('should display the search', () => {
      const search = fixture.debugElement.query(By.css('#filters')).nativeElement;
      expect(search).toBeTruthy();
    });

    it('should not display the pagination', () => {
      expect(fixture.debugElement.query(By.css('#pagination'))).toBeNull();
    });

    it('should populate audit records', () => {
      const des: DebugElement[] = fixture.debugElement.queryAll(By.css('#table tr td'));
      expect(des.length).toBe(9 * 4);
      expect(des[0].nativeElement.textContent).toContain('1');
      // expect(des[1].nativeElement.textContent).toContain('2018-10-16T13:36:01.720Z');
      expect(des[2].nativeElement.textContent).toContain('CREATE');
      expect(des[3].nativeElement.textContent).toContain('APP_REGISTRATION');
      expect(des[4].nativeElement.textContent).toContain('foo1');
      expect(des[5].nativeElement.textContent).toContain('N/A');
      expect(des[6].nativeElement.textContent).toContain('bar1');
      expect(des[7].nativeElement.textContent).toContain('kubernetes');
    });

    it('should refresh the page', () => {
      const spy = spyOn(component, 'loadAuditRecords');
      fixture.debugElement.query(By.css('button[name=app-refresh]')).nativeElement.click();
      fixture.detectChanges();
      expect(spy).toHaveBeenCalled();
    });

  });

});
