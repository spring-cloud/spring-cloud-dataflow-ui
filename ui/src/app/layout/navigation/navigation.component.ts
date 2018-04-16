import { Component, DoCheck, OnInit } from '@angular/core';
import { SecurityInfo } from '../../shared/model/about/security-info.model';
import { AuthService } from '../../auth/auth.service';

/**
 * Navigation component
 *
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
})
export class NavigationComponent implements DoCheck {

  /**
   * Security Info
   */
  securityInfo: SecurityInfo;

  /**
   * Collapsed state
   * @type {boolean}
   */
  isCollapsed = true;

  /**
   * Contructor
   *
   * @param {AuthService} authService
   */
  constructor(private authService: AuthService) {
    this.securityInfo = authService.securityInfo;
  }

  /**
   * Do check
   */
  ngDoCheck() {
    this.securityInfo = this.authService.securityInfo;
  }

  /**
   * Toggle Collapse
   */
  public toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }

  /**
   * Collapse
   */
  public collapse(): void {
    if (!this.isCollapsed) {
      this.isCollapsed = true;
    }
  }

}
