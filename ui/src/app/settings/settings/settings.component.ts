import { Component, OnInit } from '@angular/core';
import { themeActiveKey } from '../store/settings.reducer';
import { SettingsService } from '../settings.service';
import { ModalDialog } from '../../shared/service/modal.service';
import { SettingModel } from '../../shared/model/setting.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent extends ModalDialog implements OnInit {

  themeActive: SettingModel;
  resultsPerPage: SettingModel;

  constructor(
    private settingsService: SettingsService
  ) {
    super();
  }

  ngOnInit() {
    this.settingsService.getSettings()
      .subscribe(settings => {
        this.themeActive = settings.find(st => st.name === 'theme-active');
        this.resultsPerPage = settings.find(st => st.name === 'results-per-page');
      });
  }

  themeActiveSettingOnChange(theme: string) {
    this.settingsService.dispatch({ name: 'theme-active', value: theme });
  }

  resultPerPageSettingOnChange(count: string) {
    this.settingsService.dispatch({ name: 'results-per-page', value: count });
  }
}
