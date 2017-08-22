import { Component, DoCheck } from '@angular/core';
import { ToastyConfig } from 'ng2-toasty';
import { AuthService } from './auth/auth.service';
import { SecurityInfo } from './auth/model/security-info.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements DoCheck {

  public securityInfo: SecurityInfo;
  public isCollapsed = true;

  constructor(private toastyConfig: ToastyConfig, private authService: AuthService) {
    this.toastyConfig.theme = 'bootstrap';
    this.toastyConfig.limit = 5;
    this.toastyConfig.showClose = true;
    this.toastyConfig.position  =  'top-right';
    this.toastyConfig.timeout   = 3000;

    this.securityInfo = authService.securityInfo;
  }

  ngDoCheck() {
    this.securityInfo = this.authService.securityInfo;
  }

  public toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  public collapse(): void {
    if (!this.isCollapsed) {
      this.isCollapsed = true;
    }
  }
}
