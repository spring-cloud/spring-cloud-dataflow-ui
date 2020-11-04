import { AfterContentChecked, ChangeDetectorRef, Directive, OnDestroy } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Page } from '../../model/page.model';
import set from 'lodash.set';
import { ContextService } from '../../service/context.service';
import { ContextModel } from '../../model/context.model';
import { SettingsService } from '../../../settings/settings.service';
import { map, mergeMap } from 'rxjs/operators';
import { Subscription } from 'rxjs';

/* tslint:disable:directive-class-suffix */
@Directive()
export abstract class DatagridComponent implements OnDestroy, AfterContentChecked {


  private subscriptionDatagrid: Subscription;
  protected page: Page<any>;
  unsubscribe$: Subscription;
  contextName: string;
  loading = true;
  isInit = false;
  isDestroy = false;
  context;
  selected = [];
  grouped = false;
  state: ClrDatagridStateInterface;

  resultsPerPage;

  constructor(protected contextService: ContextService,
              protected settingsService: SettingsService,
              protected cdRef: ChangeDetectorRef,
              contextName: string) {
    this.contextName = contextName;
    this.subscriptionDatagrid = this.contextService.getContext(contextName)
      .pipe(
        mergeMap(context => this.settingsService.getSettings()
          .pipe(
            map(settings => ({ context, settings }))
          )
        )
      )
      .subscribe(({ context, settings }) => {
        this.resultsPerPage = +settings.find(st => st.name === 'results-per-page').value;
        const ctx = {};
        context.forEach((ct: ContextModel) => {
          if (ct.name === 'size' && !ct.value) {
            set(ctx, ct.name, this.resultsPerPage);
          } else {
            set(ctx, ct.name, ct.value);
          }
        });
        this.context = ctx;
        this.isInit = true;
      });
  }

  ngAfterContentChecked() {
    this.cdRef.detectChanges();
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
    const merged = { ...this.context, ...obj };
    Object.keys(merged).forEach(key => {
      const val = merged[key] as string;
      if (key === 'size' && val === this.resultsPerPage) {
        context.push({ name: key, value: '' });
      } else {
        context.push({ name: key, value: val });
      }
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
      current: state?.page?.current,
      size: state?.page?.size,
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
    if (this.unsubscribe$) {
      this.unsubscribe$.unsubscribe();
    }
  }

  ngOnDestroy(): void {
    this.isDestroy = true;
    this.subscriptionDatagrid.unsubscribe();
    if (this.unsubscribe$) {
      this.unsubscribe$.unsubscribe();
    }
  }
}
