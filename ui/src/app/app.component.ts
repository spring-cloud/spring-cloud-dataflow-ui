import { Component, OnInit } from '@angular/core';
import { NotificationService } from './shared/service/notification.service';
import { ThemeService } from './layout/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  title = 'Spring Cloud Data Flow';

  darkThemeIsActive = false;

  toggleDarkTheme() {
    if (this.darkThemeIsActive) {
      this.themeService.switchTheme('default');
      this.darkThemeIsActive = false;
    } else {
      this.themeService.switchTheme('dark');
      this.darkThemeIsActive = true;
    }
  }

  constructor(private themeService: ThemeService) {
    // themeService.switchTheme('dark');
    // this.darkThemeIsActive = true;
  }

}
