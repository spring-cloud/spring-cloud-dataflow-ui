import { Component, OnInit } from '@angular/core';
import { themeActiveKey } from '../store/settings.reducer';
import { SettingsService } from '../settings.service';
import { ModalDialog } from '../../shared/service/modal.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html'
})
export class SettingsComponent extends ModalDialog implements OnInit {

  themeActiveSetting$ = this.settingsService.themeActiveSetting();

  constructor(
    private settingsService: SettingsService
  ) {
    super();
  }

  ngOnInit() {
  }

  themeActiveSettingOnChange(theme: string) {
    this.settingsService.dispatch({ name: 'theme-active', value: theme });
  }
}
