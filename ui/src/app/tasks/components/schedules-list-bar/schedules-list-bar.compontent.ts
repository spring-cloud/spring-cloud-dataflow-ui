/**
 * Lit Bar Filters
 * Display grouped actions / input search / refresh action
 */
import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Page } from '../../../shared/model';
import { ListDefaultParams } from '../../../shared/components/shared.interface';
import { Platform } from '../../../shared/model/platform';
import { ListSchedulesParams } from '../../model/task-schedule';

@Component({
  selector: 'app-schedules-list-bar',
  template: `
    <form id="filters" class="list-bar" [class.list-bar-schedules]="isPlatformActive()"
          *ngIf="page && params && !isEmpty()" #filterForm="ngForm"
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
            <a *ngIf="!action['hidden']" id="{{ action.id }}" style="cursor: pointer"
               (click)="this.applyAction(action.action)">
              {{ action.title }}
            </a>
          </li>
        </ul>
      </div>
      <div class="list-bar-filter" *ngIf="!hideSearch">
        <input type="text" id="q" name="q" class="form-control input-sm" placeholder="Filter items"
               [(ngModel)]="form.q">
        <div class="list-bar-dropdown list-bar-dropdown-lg" *ngIf="isPlatformActive()">
          <div dropdown class="dropdown">
            <a class="filter-dropdown-toggle" dropdownToggle>
              Platform: <strong>{{ form.platform }}</strong>
              <span class="caret"></span>
            </a>
            <ul class="dropdown-menu dropdown-menu-right" *dropdownMenu="">
              <li *ngFor="let platform of platforms" [class.active]="form.platform == '' || form.platform == null">
                <a (click)="form.platform = platform.name">{{platform.name}}</a>
              </li>
            </ul>
          </div>
        </div>
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
export class SchedulesListBarComponent implements OnInit {

  /**
   * Page
   */
  @Input() page: Page<any>;

  /**
   * Params
   */
  @Input() params: ListSchedulesParams;

  /**
   * Params
   */
  @Input() platforms: Platform[];

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
  form = { q: '', platform: '' };

  constructor() {
  }

  /**
   * Init
   */
  ngOnInit() {
    if (this.params) {
      this.form.q = this.params['q'];
      this.form.platform = this.params.platform;
    }
    if (!this.params.platform && this.platforms) {
      this.form.platform = this.platforms[0].name;
    }
    this._actions = this.actions;
  }

  /**
   * Determine if there is no application
   */
  isEmpty(): boolean {
    if (this.page && this.page.totalPages < 2 && this.page.totalElements < 1) {
      return (this.params['q'] === '' || !this.params['q']) && (this.params['platform'] === '' || !this.params['platform']);
    }
    return false;
  }

  /**
   * Return true if show platform select
   */
  isPlatformActive() {
    if (this.platforms) {
      return this.platforms.length > 1;
    }
    return false;
  }

  /**
   * Used to determinate the state of the query parameters
   * @returns {boolean} Search is active
   */
  isSearchActive() {
    return (this.form.q !== this.params.q) || (this.form.platform !== this.params.platform);
  }


  /**
   * Reset the search parameters and run the search
   */
  clearSearch() {
    this.form.q = '';
    if (this.platforms) {
      this.form.platform = this.platforms[0].name;
    }
    this.doSearch();
  }

  /**
   * Do Search
   * Emit a Search Event
   */
  doSearch() {
    const params: ListSchedulesParams = Object.assign(this.params, {
      q: this.form.q,
      page: 1,
      platform: this.form.platform
    });
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
