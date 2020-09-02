import { Directive, OnDestroy } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Page } from '../../model/page.model';
import set from 'lodash.set';
import { ContextService } from '../../service/context.service';
import { ContextModel } from '../../model/context.model';

@Directive()
export abstract class DatagridComponent implements OnDestroy {

  contextName: string;
  protected page: Page<any>;
  loading = true;
  isInit = false;
  isDestroy = false;
  context;
  selected = [];
  grouped = false;
  state: ClrDatagridStateInterface;
  // @ViewChildren(ClrDatagridHideableColumn)
  // columns: QueryList<ClrDatagridHideableColumn>;

  constructor(protected contextService: ContextService,
              contextName: string) {
    this.contextName = contextName;
    this.contextService.getContext(contextName)
      .subscribe((context: ContextModel[]) => {
        const ctx = {};
        context.forEach((ct: ContextModel) => {
          set(ctx, ct.name, ct.value);
        });
        this.context = ctx;
        this.isInit = true;
      });
  }

  updateContext(key, value) {
    set(this.context, key, value);
    const context = [];
    Object.keys(this.context).map((kt) => {
      context.push({ name: kt, value: this.context[kt] });
    });
    this.contextService.updateContext(this.contextName, context);
  }

  updateGroupContext(obj: object): void {
    if (this.isDestroy || !this.isInit) {
      return;
    }
    const context = [];
    Object.keys(obj).forEach(key => {
      context.push({ name: key, value: obj[key] as string });
    });
    this.contextService.updateContext(this.contextName, context);
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
