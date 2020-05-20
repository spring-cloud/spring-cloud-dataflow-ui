import { OnDestroy, OnInit, QueryList, ViewChild, ViewChildren } from '@angular/core';
import { ContextService } from '../../service/context.service';
import { ClrDatagridHideableColumn, ClrDatagridStateInterface } from '@clr/angular';
import { Page } from '../../model/page.model';

export class DatagridComponent implements OnInit, OnDestroy {

  protected page: Page<any>;
  protected contextName = 'default';
  loading = true;
  isInit = false;
  isDestroy = false;
  context;
  selected = [];
  grouped = false;
  state: ClrDatagridStateInterface;
  first = true;
  @ViewChildren(ClrDatagridHideableColumn)
  columns: QueryList<ClrDatagridHideableColumn>;

  constructor(protected contextService: ContextService,
              contextName: string) {
    this.contextName = contextName;
  }

  ngOnInit(): void {
    this.context = { ...this.contextService.get(this.contextName), cols: [...this.contextService.get(`${this.contextName}.cols`)] };
    this.isInit = true;
  }

  updateContext(key, value) {
    this.contextService.update(`${this.contextName}.${key}`, value);
  }

  updateGroupContext(arr: object) {
    if (this.isDestroy || !this.isInit) {
      return;
    }
    Object.keys(arr).forEach(key => {
      this.contextService.update(`${this.contextName}.${key}`, arr[key]);
    });
  }

  getParams(state: ClrDatagridStateInterface, filters) {
    if (state.filters) {
      for (const filter of state.filters) {
        const { property, value } = filter;
        filters[property] = value;
      }
    }
    return {
      current: state.page.current,
      size: state.page.size,
      by: state?.sort?.by || '',
      reverse: state?.sort?.reverse,
      ...filters
    };
  }

  attachColumns() {
    if (this.first) {
      this.first = false;
      this.columns.forEach((col: ClrDatagridHideableColumn, index) => {
        col.hiddenChange
          .subscribe((data) => {
            const state = [...this.context.cols];
            state[index] = !data;
            this.updateContext('cols', state);
          });
      });
    }
  }

  isReady() {
    return this.isInit && !this.isDestroy;
  }

  setMode(grouped: boolean) {
    this.grouped = grouped;
    this.selected = [];
  }

  refresh(state: ClrDatagridStateInterface) {
    this.state = state;
    this.loading = true;
    this.grouped = false;
  }

  ngOnDestroy(): void {
    this.isDestroy = true;
  }
}
