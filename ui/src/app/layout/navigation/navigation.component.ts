import { Component, DoCheck, HostListener, OnInit, Renderer2 } from '@angular/core';
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
export class NavigationComponent implements DoCheck, OnInit {

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
   * Small screen size
   * @type {boolean}
   */
  isSm = false;

  /**
   * Contructor
   *
   * @param {AuthService} authService
   * @param {Renderer2} renderer
   */
  constructor(private authService: AuthService,
              private renderer: Renderer2) {
    this.securityInfo = authService.securityInfo;
  }

  /**
   * Init
   */
  ngOnInit() {
    if (this.isCollapsed) {
      this.renderer.addClass(document.body, 'sidebar-fixed');
    }
  }

  /**
   * Do check
   */
  ngDoCheck() {
    this.securityInfo = this.authService.securityInfo;
  }

  /**
   * Listener on Resize Window
   */
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.update();
  }

  /**
   * Update states
   */
  update() {
    this.isSm = document.documentElement.clientWidth < 900;
    if (this.isSm && this.isCollapsed) {
      this.toggle();
    }
  }

  /**
   * Toggle sidebar
   */
  toggle() {
    if (this.isCollapsed) {
      this.renderer.removeClass(document.body, 'sidebar-fixed');
      this.renderer.removeClass(document.body, 'sidebar-open');
    } else {
      this.renderer.addClass(document.body, 'sidebar-fixed');
    }
    this.isCollapsed = !this.isCollapsed;
  }

}
