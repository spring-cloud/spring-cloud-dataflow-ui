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
    return path;
  }

  public static fixReverseProxyUrl(url: string, active: boolean) {
    if (!active) {
      return url;
    }
    try {
      const urlToFix: URL = new URL(url);
      const baseUrl: URL = new URL(window.location.href);
      urlToFix.host = baseUrl.host;
      urlToFix.protocol = baseUrl.protocol;
      urlToFix.port = baseUrl.port;
      return urlToFix.href;
    } catch (_) {
      return url;
    }
  }
}
