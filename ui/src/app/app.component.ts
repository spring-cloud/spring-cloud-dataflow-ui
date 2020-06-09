import { Component } from '@angular/core';
import { ThemeService } from './layout/theme/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html'
})
export class AppComponent {
  toggleDarkTheme() {
    this.themeService.switchTheme(this.themeService.getTheme() === 'dark' ? 'default' : 'dark');
  }

  get darkThemeIsActive() {
    return this.themeService.getTheme() === 'dark';
  }

  constructor(private themeService: ThemeService) {
    if (this.themeService.getTheme() === 'dark') {
      themeService.switchTheme('dark');
    }
  }
}
