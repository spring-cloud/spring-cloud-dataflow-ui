import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Page } from '../../model/page';
import { ListDefaultParams } from '../shared.interface';

/**
 * Lit Bar Filters
 * Display grouped actions / input search / refresh action
 */
@Component({
  selector: 'app-list-bar',
  template: `
    <form id="filters" class="list-bar" *ngIf="page && params && !isEmpty()" #filterForm="ngForm"
          name="filterForm" role="form" (ngSubmit)="doSearch()" novalidate>
      <div *ngIf="hasActions()" id="dropdown-actions" class="list-bar-action dropdown" dropdown
           [isDisabled]="!(countSelected > 0)">
        <button dropdownToggle type="button" class="btn btn-default btn-dropdown">
          <span>Actions</span>
          <strong *ngIf="countSelected > 0" style="margin-left: 4px;">({{ countSelected }})</strong>
          <span class="caret"></span>
        </button>
        <ul *dropdownMenu class="dropdown-menu">
          <li *ngFor="let action of _actions">
            <a *ngIf="!action['hidden']" id="{{ action.id }}" style="cursor: pointer" (click)="this.applyAction(action.action)">
              {{ action.title }}
            </a>
          </li>
        </ul>
      </div>
      <div class="list-bar-filter" *ngIf="!hideSearch">
        <input type="text" id="q" name="q" class="form-control input-sm" placeholder="Filter items"
               [(ngModel)]="form.q">
        <button id="search-submit" [disabled]="!isSearchActive()" type="submit" class="list-bar-submit btn btn-default">
          <span class="fa fa-search"></span>
        </button>
      </div>
      <div class="list-bar-divider"></div>
      <div class="list-bar-right">
        <button (click)="doRefresh()" name="app-refresh" type="button" class="btn btn-default btn-fa"
                title="Refresh">
          <span class="fa fa-refresh"></span>
          Refresh
        </button>
      </div>
    </form>
  `,
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ListBarComponent implements OnInit {

  /**
   * Page
   */
  @Input() page: Page<any>;

  /**
   * Params
   */
  @Input() params: ListDefaultParams;

  /**
   * Refresh
   */
  @Output() refresh = new EventEmitter();

  /**
   * Search
   */
  @Output() search = new EventEmitter();

  /**
   * Search
   */
  @Output() action = new EventEmitter();

  /**
   * Count selected checkbox
   */
  @Input() countSelected = 0;

  /**
   * Actions
   */
  @Input() actions: Array<any>;

  /**
   * Copy of actions
   */
  _actions: Array<any>;

  /**
   * Hide the search inputs
   * @type {boolean}
   */
  @Input() hideSearch = false;

  /**
   * Form
   */
  form = { q: '' };

  constructor() {
  }

  /**
   * Init
   */
  ngOnInit() {
    if (this.params) {
      this.form.q = this.params['q'];
    }
    this._actions = this.actions;
  }

  /**
   * Determine if there is no application
   */
  isEmpty(): boolean {
    if (this.page && this.page.totalPages < 2 && this.page.totalElements < 1) {
      return (this.params['q'] === '' || !this.params['q']);
    }
    return false;
  }

  /**
   * Used to determinate the state of the query parameters
   * @returns {boolean} Search is active
   */
  isSearchActive() {
    return (this.form.q !== this.params.q);
  }


  /**
   * Reset the search parameters and run the search
   */
  clearSearch() {
    this.form.q = '';
    this.doSearch();
  }

  /**
   * Do Search
   * Emit a Search Event
   */
  doSearch() {
    const params: ListDefaultParams = Object.assign(this.params, { q: this.form.q, page: 1 });
    this.search.emit(params);
  }

  /**
   * Do Refresh
   * Emit a Refresh Event
   */
  doRefresh() {
    this.refresh.emit();
  }

  applyAction(action) {
    this.action.emit({ action: action });
  }

  /**
   * Has Actions
   * @returns {boolean}
   */
  hasActions() {
    if (!this._actions) {
      return false;
    }
    if (this._actions.length === 0) {
      return false;
    }
    if (this._actions.filter((ac) => !ac['hidden']).length === 0) {
      return false;
    }
    return true;
  }

}
