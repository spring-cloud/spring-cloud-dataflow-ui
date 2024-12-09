import {Component, OnInit} from '@angular/core';
import {SettingsService} from '../settings.service';
import {ModalDialog} from '../../shared/service/modal.service';
import {SettingModel} from '../../shared/model/setting.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent extends ModalDialog implements OnInit {
  themeActive: SettingModel;
  resultsPerPage: SettingModel;
  languageActive: SettingModel;
  reverseProxyFix: SettingModel;
  languages: Array<string>;

  constructor(private settingsService: SettingsService) {
    super();
  }

  ngOnInit(): void {
    this.languages = this.settingsService.language;
    this.settingsService.getSettings().subscribe(settings => {
      this.themeActive = settings.find(st => st.name === 'theme-active');
      this.resultsPerPage = settings.find(st => st.name === 'results-per-page');
      this.languageActive = settings.find(st => st.name === 'language-active');
      this.reverseProxyFix = settings.find(st => st.name === 'reverse-proxy-fix-active');
    });
  }

  themeActiveSettingOnChange(theme: string): void {
    this.settingsService.dispatch({name: 'theme-active', value: theme});
  }

  resultPerPageSettingOnChange(count: string): void {
    this.settingsService.dispatch({name: 'results-per-page', value: count});
  }

  languageActiveSettingOnChange(language: string): void {
    this.settingsService.dispatch({name: 'language-active', value: language});
  }

  reverseProxyFixOnChange(active: string): void {
    this.settingsService.dispatch({name: 'reverse-proxy-fix-active', value: active});
  }
}
