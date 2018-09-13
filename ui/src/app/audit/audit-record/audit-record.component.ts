import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { SortParams } from '../../shared/components/shared.interface';
import { Subject } from 'rxjs/Subject';
import { takeUntil } from 'rxjs/operators';
import { BusyService } from '../../shared/services/busy.service';
import { NotificationService } from '../../shared/services/notification.service';
import { LoggerService } from '../../shared/services/logger.service';
import { AppError } from '../../shared/model/error.model';
import { ListBarComponent } from '../../shared/components/list/list-bar.component';
import { AuditRecord, AuditOperationType, AuditActionType } from '../../shared/model/audit-record.model';
import { AuditRecordService } from '../audit-record.service';
import { Page } from '../../shared/model';
import { AuditRecordListParams } from '../components/audit.interface';

/**
 * Main entry point to the Apps Module. Provides
 * a paginated list of {@link AppRegistration}s and
 * also provides operations to unregister {@link AppRegistration}s,
 * displays versions control if skipper is enabled.
 *
 * @author Gunnar Hillert
 */
@Component({
  selector: 'app-audit-record',
  templateUrl: './audit-record.component.html'
})
export class AuditRecordComponent implements OnInit, OnDestroy {

  /**
   * Current AuditRecord items
   */
  auditRecords: Page<AuditRecord>;

  /**
   * Busy Subscriptions
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Current forms value
   */
  form: any = {
    action: null,
    operation: null
  };

  public searchForm: FormGroup;

  /**
   * State of App List Params
   * @type {SortParams}
   */
  params: AuditRecordListParams = null;

  /**
   * Contain a key application of each selected application
   * @type {Array}
   */
  itemsSelected: Array<string> = [];

  /**
   * Storage context
   */
  context: any;

  /**
   * List Bar Component
   */
  @ViewChild('listBar')
  listBar: ListBarComponent;

  /**
   * Constructor
   *
   * @param {AuditRecordService} auditRecordService
   * @param {NotificationService} notificationService
   * @param {BusyService} busyService
   * @param {LoggerService} loggerService
   * @param {Router} router
   */
  constructor(public auditRecordService: AuditRecordService,
              private notificationService: NotificationService,
              private busyService: BusyService,
              private loggerService: LoggerService,
              private router: Router) {
  }

  private initForm() {
    this.searchForm = new FormGroup({
      'actionType': new FormControl('', Validators.required),
      'operationType': new FormControl('', Validators.required)
    });
  }

  /**
   * As soon as the page loads we retrieve a list of {@link AppRegistration}s
   * after init the context.
   */
  ngOnInit() {
    this.context = this.auditRecordService.auditContext;
    this.params = { ...this.context };
    this.initForm();
    this.loadAuditRecords();
    this.form = { q: this.context.q, action: this.context.action, operation: this.context.operation };
    this.itemsSelected = this.context.itemsSelected || [];
    this.auditRecordService.loadAuditActionTypes();
    this.auditRecordService.loadAuditOperationTypes();
  }

  /**
   * On Destroy operations
   */
  ngOnDestroy() {
    this.updateContext();
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Return a list of action for an audit record
   * @param {number} index
   */
  auditActions(index: number) {
    return [
      {
        id: 'viewDetails' + index,
        icon: 'info-circle',
        action: 'viewDetails',
        title: 'Show details',
        isDefault: true
      }
    ];
  }

  /**
   * Apply Action
   * @param action
   * @param args
   */
  applyAction(action: string, args?: any) {
    switch (action) {
      case 'viewDetails':
        this.viewDetails(args);
        break;
    }
  }

  /**
   * Load a paginated list of {@link AuditRecord}s.
   * Build the form checkboxes (persist selection)
   */
  loadAuditRecords() {
    const busy = this.auditRecordService.getAuditRecords(this.params)
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe((page: Page<AuditRecord>) => {
          if (page.items.length === 0 && this.params.page > 0) {
            this.params.page = 0;
            return;
          }
          this.auditRecords = page;
          this.updateContext();
        },
        error => {
          this.notificationService.error(AppError.is(error) ? error.getMessage() : error);
        });
    this.busyService.addSubscription(busy);
  }

  /**
   * Refresh the page
   * Work around: invalidate the cache applications
   */
  refresh() {
    this.loadAuditRecords();
  }

  /**
   * Write the context in the service.
   */
  updateContext() {
    this.context.q = this.params.q;
    this.context.action = this.params.action;
    this.context.operation = this.params.operation;
    this.context.sort = this.params.sort;
    this.context.order = this.params.order;
    this.context.page = this.params.page;
    this.context.size = this.params.size;
    this.context.itemsSelected = this.itemsSelected;
  }

  /**
   * Apply sort
   * Triggered on column header click
   *
   * @param {SortParams} sort
   */
  applySort(sort: SortParams) {
    this.params.sort = sort.sort;
    this.params.order = sort.order;
    this.loadAuditRecords();
  }

  /**
   * Run the search
   */
  search(value: AuditRecordListParams) {
    this.params.q = value.q;
    this.params.action = value.action;
    this.params.operation = value.operation;
    this.params.page = 0;
    this.loadAuditRecords();
  }

  /**
   * Update event from the Paginator Pager
   * @param params
   */
  changePaginationPager(params) {
    this.params.page = params.page;
    this.params.size = params.size;
    this.updateContext();
    this.loadAuditRecords();
  }

  /**
   * Navigate to the page that provides a detail view for the
   * passed-in {@link AuditRecord}.
   *
   * @param {AuditRecord} auditRecord
   */
  viewDetails(auditRecord: AuditRecord) {
    this.loggerService.log(`View audit record ${auditRecord.auditRecordId}.`, auditRecord);
    this.router.navigate(['audit-records/' + auditRecord.auditRecordId]);
  }

  /**
   * Returns all supported {@link AuditOperationType}s.
   */
  public get operationTypes(): Subject<AuditOperationType[]> {
    return this.auditRecordService.auditOperationTypes$;
  }

  /**
   * Returns all supported {@link AuditActionType}s.
   */
  public get actionTypes(): Subject<AuditActionType[]> {
    return this.auditRecordService.auditActionTypes$;
  }

}
