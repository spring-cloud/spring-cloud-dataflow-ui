import {Inject, Injectable} from '@angular/core';
import {Theme} from './types';
import {defaultTheme} from './default-theme';
import {darkTheme} from './dark-theme';
import {LocalStorageService} from '../../shared/service/local-storage.service';
import {DOCUMENT} from '@angular/common';

const themePrefix = 'scdf-theme_';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private themes: Theme[] = [defaultTheme, darkTheme];
  active = 'default';

  constructor(
    @Inject(DOCUMENT) private document: Document,
    private localStorageService: LocalStorageService
  ) {}

  getTheme(): string {
    if (this.localStorageService.get('theme')) {
      return this.localStorageService.get('theme');
    }
    return this.active;
  }

  removeThemes(): void {
    const dark = themePrefix + 'dark';
    if (document.getElementById(dark) !== null) {
      document.getElementById(dark).remove();
    }
    const light = themePrefix + 'default';
    if (document.getElementById(light) !== null) {
      document.getElementById(light).remove();
    }
  }

  switchTheme(name: string): string {
    this.document.body.setAttribute('cds-theme', name);
    const style = document.createElement('style');
    const theme = this.themes.find(t => t.name === name);
    if (!theme) {
      throw new Error(`Theme not found: '${name}'`);
    }
    this.removeThemes();
    document.head.appendChild(style);
    style.id = themePrefix + name;
    const styles = [':root { '];
    for (const item in theme.properties) {
      if (theme.properties.hasOwnProperty(item)) {
        styles.push(item);
        styles.push(': ');
        styles.push(theme.properties[item]);
        styles.push('; ');
      }
    }
    styles.push('}');
    styles.push(theme.other);
    style.innerHTML = styles.join('');
    this.active = name;
    return name;
  }
}
