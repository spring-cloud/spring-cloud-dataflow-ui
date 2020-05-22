import { Injectable } from '@angular/core';
import { runCssVarsPolyfill } from '@clr/core';
import { Theme } from './types';
import { defaultTheme } from './default-theme';
import { darkTheme } from './dark-theme';

const themePrefix = 'custom-theme_';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {

  private themes: Theme[] = [defaultTheme, darkTheme];
  active = 'default';

  constructor() {
  }

  public toggleExistingThemes(name: string) {
    const themeToEnableId = themePrefix + name;
    const themeIds = [];

    this.themes.forEach(t => themeIds.push(themePrefix + t.name));

    themeIds.filter(t => t !== themeToEnableId).forEach(t => {
      const themeNode = document.getElementById(t);
      if (themeNode !== null) {
        (themeNode as any).sheet.disabled = true;
      }
    });

    if (document.getElementById(themeToEnableId) !== null) {
      (document.getElementById(themeToEnableId) as any).sheet.disabled = false;
      return true;
    }

    return false;
  }

  public switchTheme(name: string) {
    if (this.toggleExistingThemes(name)) {
      return;
    }

    const style = document.createElement('style');
    const theme = this.themes.find(t => t.name === name);
    if (!theme) {
      throw new Error(`Theme not found: '${name}'`);
    }

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

    runCssVarsPolyfill();

    this.active = name;
    return name;
  }

}
