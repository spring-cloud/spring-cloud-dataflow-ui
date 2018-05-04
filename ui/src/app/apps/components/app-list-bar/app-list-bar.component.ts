import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AppListParams } from '../apps.interface';
import { Page } from '../../../shared/model/page';

/**
 * Applications Unregister modal
 *
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-list-bar-app',
  templateUrl: './app-list-bar.component.html'
})
export class AppListBarComponent implements OnInit {

  /**
   * Params
   */
  @Input() params: AppListParams;

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
  @Output() search = new EventEmitter<AppListParams>();

  /**
   * Count selected checkbox
   */
  @Input() countSelected = 0;

  /**
   * Actions
   */
  @Input() actions: Array<object>;

  /**
   * Form
   */
  form = { q: '', type: null };

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
    this.form.type = this.params.type;
  }

  /**
   * Determine if there is no application
   */
  isEmpty(): boolean {
    if (this.page && this.page.totalPages < 2 && this.page.totalElements < 1) {
      return (this.params.q === '' || !this.params.q) && (!this.params.type);
    }
    return false;
  }

  /**
   * Used to determinate the state of the query parameters
   * @returns {boolean} Search is active
   */
  isSearchActive() {
    return (this.form.type !== this.params.type) || (this.form.q !== this.params.q);
  }

  /**
   * Reset the search parameters and run the search
   */
  clearSearch() {
    this.form.q = '';
    this.form.type = '';
    this.doSearch();
  }

  doSearch() {
    const params: AppListParams = Object.assign(this.params, { q: this.form.q, type: this.form.type, page: 1 });
    this.search.emit(params);
  }

  doRefresh() {
    this.refresh.emit();
  }

}
