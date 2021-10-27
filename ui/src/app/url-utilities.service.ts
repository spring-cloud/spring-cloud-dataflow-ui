import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UrlUtilities {

  static dashboard:String = "dashboard/";
  static assets:String = "assets/";

  constructor() {
  }

  public static calculateBaseApiUrl() {
    // Remove dashboard from base url
    return this.calculateBaseUrl().replace("/" + this.dashboard, "/");
  }

  public static calculateAssetUrl() {
    return this.calculateBaseUrl() + this.dashboard + this.assets;
  }

  public static calculateBaseUrl() {
    // Remove anything like index.html
    let path: string = window.location.pathname.replace(/[^/]*$/, '');
    // Check if the path ends with /
    path += path.endsWith("/") ? "" : "/"
    return path;
  }
}
