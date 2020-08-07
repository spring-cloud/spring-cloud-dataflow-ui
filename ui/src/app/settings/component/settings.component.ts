import { Component, OnInit } from '@angular/core';
import { themeActiveKey } from '../store/settings.reducer';
import { SettingsService } from '../../shared/service/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  themeActiveSetting$ = this.settingsService.themeActiveSetting();

  constructor(
    private settingsService: SettingsService
  ) { }

  ngOnInit() {
  }

  themeActiveSettingOnChange(theme: string) {
    this.settingsService.dispatch({ name: themeActiveKey, value: theme });
  }
}
