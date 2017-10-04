import { AfterViewInit, Directive, ElementRef, Input, Output, EventEmitter, HostListener,
DoCheck, Renderer2 } from '@angular/core';

import { AuthService } from '../auth.service';

/**
 * This directive will show or hide the element depending whether
 * any of the specified roles matches the roles assigned to "securityInfo"
 * in {@link AuthService}.
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
    const found = this.authService.securityInfo.canAccess(this.appRoles);

    if (!found) {
      this.renderer.setStyle(this.elem.nativeElement, 'display', 'none');
    }
  }

  /**
   * Initializes the state element and calls checkRoles().
   */
  ngAfterViewInit() {
    this.checkRoles();
  }

  /**
   * Called when Angular dirty checks a directive.
   * Will in return call checkRoles().
   */
  ngDoCheck() {
    this.checkRoles();
  }
}
