import { AfterViewInit, Directive, ElementRef, Input, Output, EventEmitter, HostListener,
DoCheck, Renderer2 } from '@angular/core';

import { AuthService } from '../auth.service';

/**
 * This directive is a helper for any situation where you need
 * to close pop-overs etc. by means of clicking outside of the
 * element.
 *
 * @author Gunnar Hillert
 */
@Directive({
    selector: '[appRoles]'
})
export class RolesDirective implements AfterViewInit, DoCheck {

  @Input()
  public appRoles: string[];

  constructor(private authService: AuthService, private elem: ElementRef, private renderer: Renderer2) {
  }

  private checkRoles() {
    let found = false;

    if (this.authService.securityInfo.isAuthenticated
        && this.authService.securityInfo.isAuthorizationEnabled) {

      if (this.authService.securityInfo.hasAnyRoleOf(this.appRoles)) {
        found = true;
      } else {
        console.log('Needed one for the following roles ' + this.appRoles + '. Found: ' + found);
      }
    } else {
      found = true;
    }

    if (found) {
      this.renderer.setStyle(this.elem.nativeElement, 'display', 'inherit');
    } else {
      this.renderer.setStyle(this.elem.nativeElement, 'display', 'none');
    }
  }
  /**
   * Initializes the state of the tri-state checkbox after component is initialized.
   */
  ngAfterViewInit() {
    this.checkRoles();
  }

   ngDoCheck() {
    this.checkRoles();
  }
}
