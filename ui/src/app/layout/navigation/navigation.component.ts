import { Component, DoCheck, HostListener, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { SecurityInfo } from '../../shared/model/about/security-info.model';
import { AuthService } from '../../auth/auth.service';
import { SharedAboutService } from 'src/app/shared/services/shared-about.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

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
export class NavigationComponent implements DoCheck, OnInit, OnDestroy {

  /**
   * Unubscribe
   */
  private ngUnsubscribe$: Subject<any> = new Subject();

  /**
   * Security Info
   */
  securityInfo: SecurityInfo;

  /**
   * Is the feature information (required for role-based visibility of features)
   * available?
   */
  featureInfoLoaded = false;

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
   * @param {SharedAboutService} sharedAboutService
   * @param {Renderer2} renderer
   */
  constructor(private authService: AuthService,
              private sharedAboutService: SharedAboutService,
              private renderer: Renderer2) {
    this.securityInfo = authService.securityInfo;
  }

  /**
   * Will cleanup any {@link Subscription}s to prevent
   * memory leaks.
   */
  ngOnDestroy() {
    this.ngUnsubscribe$.next();
    this.ngUnsubscribe$.complete();
  }

  /**
   * Init
   */
  ngOnInit() {
    if (this.isCollapsed) {
      this.renderer.addClass(document.body, 'sidebar-fixed');
    }

    this.sharedAboutService.featureInfoSubject
      .pipe(takeUntil(this.ngUnsubscribe$))
      .subscribe(event => {
        if (event) {
          this.featureInfoLoaded = true;
        }
      });
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
