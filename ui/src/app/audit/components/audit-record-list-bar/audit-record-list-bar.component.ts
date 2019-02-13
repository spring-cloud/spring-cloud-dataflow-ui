import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuditRecordListParams } from '../audit.interface';
import { Page } from '../../../shared/model/page';
import { AuditOperationType, AuditActionType } from '../../../shared/model/audit-record.model';
import { Subject } from 'rxjs';
import { DateTime } from 'luxon';

/**
 * Audit Record List Bar
 *
 * @author Gunnar Hillert
 */
@Component({
  selector: 'app-list-bar-audit-record',
  styleUrls: ['./styles.scss'],
  templateUrl: './audit-record-list-bar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AuditRecordListBarComponent implements OnInit {

  /**
   * Params
   */
  @Input() params: AuditRecordListParams;

  /**
   * Page
   */
  @Input() page: Page<any>;

  /**
   * Refresh
   */
  @Output() refresh = new EventEmitter();

  /**
   * Search
   */
  @Output() search = new EventEmitter<AuditRecordListParams>();

  /**
   * Action
   */
  @Output() action = new EventEmitter<any>();

  /**
   * Count selected checkbox
   */
  @Input() countSelected = 0;

  /**
   * Actions
   */
  @Input() actions: Array<object>;

  /**
   * Operation Types
   */
  @Input() operationTypes: Subject<AuditOperationType>;

  /**
   * Actions
   */
  @Input() actionTypes: Subject<AuditActionType>;


  /**
   * Form
   */
  form = {
    q: '',
    operation: null,
    action: null,
    dateRange: null
  };

  /**
   * Constructor
   */
  constructor() {
  }

  /**
   * On Init
   */
  ngOnInit() {
    this.form.q = this.params.q;
    this.form.operation = this.params.operation;
    this.form.action = this.params.action;
    if (this.params.fromDate && this.params.toDate) {
      this.form.dateRange = [
        this.params.fromDate.toJSDate(), this.params.toDate.toJSDate()
      ];
    }
  }

  /**
   * Determine if there is no audit record
   */
  isEmpty(): boolean {
    if (this.page && this.page.totalPages < 2 && this.page.totalElements < 1) {
      return (this.params.q === '' || !this.params.q)
        && (!this.params.action) && (!this.params.operation) && (!this.params.toDate) && (!this.params.fromDate);
    }
    return false;
  }

  /**
   * Used to determinate the state of the query parameters
   * @returns {boolean} Search is active
   */
  isSearchActive() {
    let paramRange = '';
    let formRange = '';
    const values = this.splitControlDate();
    if (values.fromDate && values.toDate) {
      formRange = `${values.fromDate.toISO()}-${values.toDate.toISO()}`;
    }
    if (this.params.fromDate && this.params.toDate) {
      paramRange = `${this.params.fromDate.toISO()}-${this.params.toDate.toISO()}`;
    }
    return (this.form.action !== this.params.action)
      || (this.form.operation !== this.params.operation)
      || (this.form.q !== this.params.q)
      || (paramRange !== formRange);
  }

  splitControlDate() {
    let fromDate, toDate;
    if (this.form.dateRange && Array.isArray(this.form.dateRange) && this.form.dateRange.length === 2) {
      fromDate = DateTime.fromJSDate(this.form.dateRange[0]).startOf('day');
      toDate = DateTime.fromJSDate(this.form.dateRange[1]).endOf('day');
    }
    return {
      fromDate: fromDate,
      toDate: toDate
    };
  }

  /**
   * Reset the search parameters and run the search
   */
  clearSearch() {
    this.form.q = '';
    this.form.action = null;
    this.form.operation = null;
    this.form.dateRange = null;
    this.doSearch();
  }

  doSearch() {
    const values = this.splitControlDate();
    const params: AuditRecordListParams = Object.assign(this.params, {
      q: this.form.q,
      action: this.form.action,
      operation: this.form.operation,
      fromDate: values.fromDate,
      toDate: values.toDate,
      page: 1
    });
    this.search.emit(params);
  }

  doRefresh() {
    this.refresh.emit();
  }

  fire(action) {
    this.action.emit({ action: action });
  }

}
