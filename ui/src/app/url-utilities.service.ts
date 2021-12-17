import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlUtilities {
  static dashboard = 'dashboard/';
  static assets = 'assets/';
  constructor() {}

  public static calculateBaseApiUrl() {
    // Remove dashboard from base url
    return this.calculateBaseUrl().replace('/' + this.dashboard, '/');
  }

  public static calculateAssetUrl() {
    return this.calculateBaseUrl() + this.assets;
  }

  public static calculateBaseUrl() {
    // Remove anything like index.html
    let path: string = window.location.pathname.replace(/[^/]*$/, '');
    // Check if the path ends with /
    path += path.endsWith('/') ? '' : '/';
    path = path.replace('/en/', '/');
    path = path.replace('/de/', '/');
    return path;
  }
}
