import {
  AfterViewInit, Directive, ElementRef, Input, Output, EventEmitter, HostListener,
  Renderer2, OnInit
} from '@angular/core';
import { AuthService } from '../auth.service';
import { SharedAboutService } from '../../shared/services/shared-about.service';

/**
 * This directive will show or hide the element depending whether
 * any of the specified roles matches the roles assigned to "securityInfo"
 * in {@link AuthService}.
 *
 * @author Gunnar Hillert
 */
@Directive({
    selector: '[dataflowAppRoles]'
})
export class RolesDirective implements AfterViewInit, OnInit {

  @Input()
  public dataflowAppRoles: string[];

  @Input()
  public appFeature: string;

  private existingDisplayPropertyValue: string;
  constructor(
    private authService: AuthService,
    private sharedAboutService: SharedAboutService,
    private elem: ElementRef, private renderer: Renderer2) {
  }

  private checkRoles() {
    if (this.appFeature) {
      this.sharedAboutService.getFeatureInfo().subscribe(featureInfo => {
        const featureEnabled = this.appFeature ? featureInfo.isFeatureEnabled(this.appFeature) : true;
        this.checkRoleAccess(featureEnabled);
      });
    } else {
      this.checkRoleAccess(true);
    }
  }

  private checkRoleAccess(featureEnabled: boolean) {
    const hasRoleAccess = this.authService.securityInfo.canAccess(this.dataflowAppRoles);
    if (!featureEnabled || !hasRoleAccess) {
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
    this.sharedAboutService.featureInfoSubject.forEach(event => {
      this.checkRoles();
    });
  }
}
