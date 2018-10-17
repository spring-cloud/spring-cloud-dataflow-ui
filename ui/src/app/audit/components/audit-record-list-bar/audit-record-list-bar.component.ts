import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuditRecordListParams } from '../audit.interface';
import { Page } from '../../../shared/model/page';
import { AuditOperationType, AuditActionType } from '../../../shared/model/audit-record.model';
import { Subject } from 'rxjs';

/**
 * Audit Record List Bar
 *
 * @author Gunnar Hillert
 */
@Component({
  selector: 'app-list-bar-audit-record',
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

  @Input() operationTypes: Subject<AuditOperationType>;
  @Input() actionTypes: Subject<AuditActionType>;


  /**
   * Form
   */
  form = {
    q: '',
    operation: null,
    action: null
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
  }

  /**
   * Determine if there is no audit record
   */
  isEmpty(): boolean {
    if (this.page && this.page.totalPages < 2 && this.page.totalElements < 1) {
      return (this.params.q === '' || !this.params.q)
        && (!this.params.action) && (!this.params.operation);
    }
    return false;
  }

  /**
   * Used to determinate the state of the query parameters
   * @returns {boolean} Search is active
   */
  isSearchActive() {
    return (this.form.action !== this.params.action)
    || (this.form.operation !== this.params.operation)
    || (this.form.q !== this.params.q);
  }

  /**
   * Reset the search parameters and run the search
   */
  clearSearch() {
    this.form.q = '';
    this.form.action = null;
    this.form.operation = null;
    this.doSearch();
  }

  doSearch() {
    const params: AuditRecordListParams = Object.assign(this.params, {
      q: this.form.q,
      action: this.form.action,
      operation: this.form.operation,
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
