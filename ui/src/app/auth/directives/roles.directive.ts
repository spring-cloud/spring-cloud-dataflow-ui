import { AfterViewInit, Directive, ElementRef, Input, Output, EventEmitter, HostListener,
Renderer2 } from '@angular/core';

import { AuthService } from '../auth.service';
import { OnInit } from '@angular/core/src/metadata/lifecycle_hooks';

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
export class RolesDirective implements AfterViewInit, OnInit {

  @Input()
  public appRoles: string[];

  private existingDisplayPropertyValue: string;
  constructor(private authService: AuthService, private elem: ElementRef, private renderer: Renderer2) {
  }

  private checkRoles() {
    const found = this.authService.securityInfo.canAccess(this.appRoles);
    if (!found) {
      this.renderer.setStyle(this.elem.nativeElement, 'display', 'none');
    } else {
      if (this.existingDisplayPropertyValue) {
        this.renderer.setStyle(this.elem.nativeElement, 'display', this.existingDisplayPropertyValue);
      } else {
        this.renderer.removeStyle(this.elem.nativeElement, 'display');
      }
    }
  }

  /**
   * Initializes the state element and calls checkRoles().
   */
  ngAfterViewInit() {
    this.existingDisplayPropertyValue = this.elem.nativeElement.style.display;
    this.checkRoles();
  }

  ngOnInit() {
    this.authService.securityInfoSubject.forEach(event => {
      this.checkRoles();
    });
  }
}
