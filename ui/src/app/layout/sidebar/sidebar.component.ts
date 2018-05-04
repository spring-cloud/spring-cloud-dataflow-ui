import { Component, DoCheck } from '@angular/core';
import { SecurityInfo } from '../../shared/model/about/security-info.model';
import { AuthService } from '../../auth/auth.service';

/**
 * Navigation component
 *
 * @author Gunnar Hillert
 * @author Damien Vitrac
 */
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
})
export class SidebarComponent implements DoCheck {

  /**
   * Security Info
   */
  securityInfo: SecurityInfo;

  /**
   * Contructor
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

}
