import { Component } from '@angular/core';
import { ThemeService } from './layout/theme/theme.service';
import { SecurityService } from './security/service/security.service';
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {

  shouldProtect = this.securityService.shouldProtect();
  securityEnabled = this.securityService.securityEnabled();

  toggleDarkTheme() {
    this.themeService.switchTheme(this.themeService.getTheme() === 'dark' ? 'default' : 'dark');
  }

  get darkThemeIsActive() {
    return this.themeService.getTheme() === 'dark';
  }

  get isDevEnv() {
    return !environment.production;
  }

  constructor(
    private themeService: ThemeService,
    private securityService: SecurityService
  ) {
    if (this.themeService.getTheme() === 'dark') {
      themeService.switchTheme('dark');
    }
  }
}
