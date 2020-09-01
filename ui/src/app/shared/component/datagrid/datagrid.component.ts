import { Directive, OnDestroy } from '@angular/core';
import { ClrDatagridStateInterface } from '@clr/angular';
import { Page } from '../../model/page.model';
import { SettingsService } from '../../../settings/settings.service';
import { SettingModel } from '../../model/setting.model';
import set from 'lodash.set';

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

  constructor(protected settingsService: SettingsService,
              contextName: string) {
    this.contextName = contextName;
    this.settingsService.getContext(contextName)
      .subscribe((settings: SettingModel[]) => {
        const ctx = {};
        settings.forEach((setting: SettingModel) => {
          set(ctx, setting.name, setting.value);
        });
        this.context = ctx;
        this.isInit = true;
      });
  }

  updateContext(key, value) {
    set(this.context, key, value);
    const settings = [];
    Object.keys(this.context).map((kt) => {
      settings.push({ name: kt, value: this.context[kt] });
    });
    this.settingsService.updateContext(this.contextName, settings);
  }

  updateGroupContext(obj: object): void {
    if (this.isDestroy || !this.isInit) {
      return;
    }
    const settings = [];
    Object.keys(obj).forEach(key => {
      settings.push({ name: key, value: obj[key] as string });
    });
    this.settingsService.updateContext(this.contextName, settings);
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
